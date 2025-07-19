<?php

namespace App\Http\Controllers;

use App\Models\MemberContribution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ContributionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->isAdmin() || $user->isTreasurer()) {
            $contributions = MemberContribution::with(['user:id,name,email', 'approvedBy:id,name'])
                ->latest()
                ->paginate(20);
        } else {
            $contributions = $user->contributions()
                ->with(['user:id,name,email', 'approvedBy:id,name'])
                ->latest()
                ->paginate(20);
        }

        return inertia('contributions/index', compact('contributions'));
    }

    public function create()
    {
        return inertia('contributions/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
            'type' => 'required|in:deposit,withdrawal',
            'description' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();

        // Generate reference number
        $referenceNumber = 'CONT-' . strtoupper(uniqid());

        $contribution = MemberContribution::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'type' => $request->type,
            'description' => $request->description,
            'reference_number' => $referenceNumber,
            'transaction_date' => now(),
            'status' => 'pending',
        ]);

        return redirect()->route('contributions.index')
            ->with('success', 'Contribution request submitted successfully. Reference: ' . $referenceNumber);
    }

    public function show(MemberContribution $contribution)
    {
        $this->authorize('view', $contribution);

        return inertia('contributions/show', compact('contribution'));
    }

    public function approve(MemberContribution $contribution)
    {
        $this->authorize('approve', $contribution);

        DB::transaction(function () use ($contribution) {
            $contribution->update([
                'status' => 'approved',
                'approved_by' => Auth::id(),
                'approved_at' => now(),
            ]);

            // Update user's total contributions and loan limit
            $user = $contribution->user;
            if ($contribution->type === 'deposit') {
                $user->increment('total_contributions', $contribution->amount);
                $user->increment('available_loan_limit', $contribution->amount);
            } else {
                $user->decrement('total_contributions', $contribution->amount);
                $user->decrement('available_loan_limit', $contribution->amount);
            }
        });

        return redirect()->back()
            ->with('success', 'Contribution approved successfully.');
    }

    public function reject(MemberContribution $contribution, Request $request)
    {
        $this->authorize('approve', $contribution);

        $contribution->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'description' => $contribution->description . ' | Rejection reason: ' . $request->reason,
        ]);

        return redirect()->back()
            ->with('success', 'Contribution rejected.');
    }
}
