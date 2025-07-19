<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanPayment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LoanController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->isAdmin() || $user->isTreasurer()) {
            $loans = Loan::with(['user', 'approvedBy'])
                ->latest()
                ->paginate(20);
        } else {
            $loans = $user->loans()
                ->with('payments')
                ->latest()
                ->paginate(20);
        }

        return inertia('loans/index', compact('loans'));
    }

    public function create()
    {
        $user = Auth::user();
        $eligibility = $user->getLoanEligibilityInfo();

        return inertia('loans/create', compact('eligibility'));
    }

    public function apply()
    {
        $user = Auth::user();
        $eligibility = $user->getLoanEligibilityInfo();

        return inertia('loans/apply', compact('eligibility'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'principal_amount' => 'required|numeric|min:1000',
            'purpose' => 'required|string|max:500',
            'repayment_period' => 'required|in:3,6,12,18,24',
            'collateral_description' => 'nullable|string|max:500',
            'guarantor_name' => 'required|string|max:255',
            'guarantor_phone' => 'required|string|max:20',
            'guarantor_relationship' => 'required|string|max:100',
        ]);

        // Check loan eligibility
        $eligibility = $user->getLoanEligibilityInfo();

        if (!$eligibility['is_eligible']) {
            return back()->withErrors([
                'error' => 'You are not eligible for a loan at this time. You need at least KSh 5,000 in contributions.'
            ]);
        }

        if ($request->principal_amount > $eligibility['max_loan_amount']) {
            return back()->withErrors([
                'principal_amount' => 'Loan amount exceeds your maximum eligibility of KSh ' . number_format($eligibility['max_loan_amount'], 2)
            ]);
        }

        $loan = new Loan();
        $loan->user_id = $user->id;
        $loan->principal_amount = $request->principal_amount;
        $loan->purpose = $request->purpose;
        $loan->repayment_period = $request->repayment_period;
        $loan->collateral_description = $request->collateral_description;
        $loan->guarantor_name = $request->guarantor_name;
        $loan->guarantor_phone = $request->guarantor_phone;
        $loan->guarantor_relationship = $request->guarantor_relationship;
        $loan->application_date = now();
        $loan->status = 'pending';
        $loan->save();

        return redirect()->route('loans.index')
            ->with('success', 'Loan application submitted successfully. Awaiting approval.');
    }

    public function show(Loan $loan)
    {
        $this->authorize('view', $loan);

        $loan->load(['user', 'approvedBy', 'payments.recordedBy']);

        return view('loans.show', compact('loan'));
    }

    public function approve(Request $request, Loan $loan)
    {
        $this->authorize('approve', $loan);

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($loan, $request) {
            $loan->update([
                'status' => 'approved',
                'approval_date' => now(),
                'approved_by' => Auth::id(),
                'due_date' => now()->addWeeks($loan->duration_weeks),
                'notes' => $request->notes,
            ]);

            // Activate the loan
            $loan->update(['status' => 'active']);
        });

        return redirect()->route('loans.show', $loan)
            ->with('success', 'Loan approved successfully.');
    }

    public function reject(Request $request, Loan $loan)
    {
        $this->authorize('approve', $loan);

        $request->validate([
            'notes' => 'required|string|max:500',
        ]);

        $loan->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'notes' => $request->notes,
        ]);

        return redirect()->route('loans.show', $loan)
            ->with('success', 'Loan rejected.');
    }

    public function addPayment(Request $request, Loan $loan)
    {
        $this->authorize('makePayment', $loan);

        $request->validate([
            'amount' => 'required|numeric|min:1|max:' . $loan->balance,
            'payment_date' => 'required|date|before_or_equal:today',
            'payment_method' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($loan, $request) {
            LoanPayment::create([
                'loan_id' => $loan->id,
                'amount' => $request->amount,
                'payment_date' => $request->payment_date,
                'payment_method' => $request->payment_method,
                'reference_number' => 'PAY-' . strtoupper(uniqid()),
                'notes' => $request->notes,
                'recorded_by' => Auth::id(),
            ]);
        });

        return redirect()->route('loans.show', $loan)
            ->with('success', 'Payment recorded successfully.');
    }

    public function defaulted()
    {
        $this->authorize('viewAny', Loan::class);

        $defaultedLoans = Loan::with(['user'])
            ->whereDate('due_date', '<', now())
            ->where('status', 'active')
            ->get();

        // Mark as defaulted and calculate penalties
        foreach ($defaultedLoans as $loan) {
            if ($loan->status === 'active') {
                $penalty = $loan->calculatePenalty();
                $loan->update([
                    'status' => 'defaulted',
                    'penalty_amount' => $penalty,
                    'penalty_days' => now()->diffInDays($loan->due_date),
                ]);
            }
        }

        $defaultedLoans = Loan::defaulted()
            ->with(['user'])
            ->latest()
            ->paginate(20);

        return view('loans.defaulted', compact('defaultedLoans'));
    }

    public function interestReport()
    {
        $this->authorize('viewReports', Loan::class);

        $interestData = Loan::completed()
            ->selectRaw('MONTH(completion_date) as month, YEAR(completion_date) as year')
            ->selectRaw('SUM(total_amount - principal_amount) as total_interest')
            ->selectRaw('COUNT(*) as loans_count')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return view('loans.interest-report', compact('interestData'));
    }
}
