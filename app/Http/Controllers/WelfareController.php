<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Loan;
use App\Models\MemberContribution;
use App\Models\CicInvestment;
use App\Models\Milestone;
use App\Models\InterestDistribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WelfareController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        // General statistics
        $totalMembers = User::active()->count();
        $totalContributions = MemberContribution::approved()->sum('amount');
        $totalLoansIssued = Loan::where('status', '!=', 'rejected')->sum('principal_amount');
        $activeLoans = Loan::active()->count();
        $totalCicInvestments = CicInvestment::active()->sum('current_value');

        // User-specific data
        $userContributions = $user->contributions()->approved()->sum('amount');
        $userActiveLoans = $user->loans()->active()->get();
        $userLoanLimit = $user->calculateLoanLimit();

        // Recent activities
        $recentContributions = MemberContribution::with('user')
            ->latest()
            ->limit(5)
            ->get();

        $recentLoans = Loan::with('user')
            ->latest()
            ->limit(5)
            ->get();

        // Milestones
        $activeMilestones = Milestone::active()
            ->orderBy('target_date')
            ->get();

        return inertia('dashboard', compact(
            'totalMembers',
            'totalContributions',
            'totalLoansIssued',
            'activeLoans',
            'totalCicInvestments',
            'userContributions',
            'userActiveLoans',
            'userLoanLimit',
            'recentContributions',
            'recentLoans',
            'activeMilestones'
        ));
    }

    public function memberProfile()
    {
        $user = Auth::user();

        $contributionHistory = $user->contributions()
            ->orderBy('transaction_date', 'desc')
            ->get();

        $loanHistory = $user->loans()
            ->with('payments')
            ->orderBy('application_date', 'desc')
            ->get();

        $interestEarnings = $user->interestDistributions()
            ->where('status', 'distributed')
            ->orderBy('distribution_date', 'desc')
            ->get();

        return view('profile', compact(
            'user',
            'contributionHistory',
            'loanHistory',
            'interestEarnings'
        ));
    }

    public function statistics()
    {
        // Monthly contribution trends
        $monthlyContributions = MemberContribution::approved()
            ->selectRaw('YEAR(transaction_date) as year, MONTH(transaction_date) as month, SUM(amount) as total')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // Loan performance
        $loanStats = [
            'total_loans' => Loan::count(),
            'active_loans' => Loan::active()->count(),
            'completed_loans' => Loan::completed()->count(),
            'defaulted_loans' => Loan::defaulted()->count(),
            'total_interest_earned' => Loan::completed()->sum(DB::raw('total_amount - principal_amount')),
        ];

        // Member analysis
        $memberStats = User::active()
            ->selectRaw('COUNT(*) as total_members')
            ->selectRaw('AVG(total_contributions) as avg_contributions')
            ->selectRaw('MAX(total_contributions) as max_contributions')
            ->selectRaw('MIN(total_contributions) as min_contributions')
            ->first();

        return view('statistics', compact(
            'monthlyContributions',
            'loanStats',
            'memberStats'
        ));
    }

    public function reportsIndex()
    {
        $totalMembers = User::active()->count();
        $totalContributions = MemberContribution::approved()->sum('amount');
        $totalLoans = Loan::where('status', '!=', 'rejected')->sum('principal_amount');
        $totalInvestments = CicInvestment::active()->sum('current_value');

        return inertia('reports/index', compact(
            'totalMembers',
            'totalContributions',
            'totalLoans',
            'totalInvestments'
        ));
    }

    public function membersReport()
    {
        $members = User::active()
            ->with(['contributions' => function($query) {
                $query->approved();
            }])
            ->with(['loans' => function($query) {
                $query->where('status', '!=', 'rejected');
            }])
            ->paginate(20);

        $memberStats = [
            'total_members' => User::active()->count(),
            'avg_contributions' => User::active()->avg('total_contributions'),
            'total_contributions' => MemberContribution::approved()->sum('amount'),
            'active_loans' => Loan::active()->count(),
        ];

        return inertia('reports/members', compact('members', 'memberStats'));
    }

    public function financialSummary()
    {
        // Monthly trends
        $monthlyContributions = MemberContribution::approved()
            ->selectRaw('YEAR(transaction_date) as year, MONTH(transaction_date) as month, SUM(amount) as total')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // Loan performance
        $loanStats = [
            'total_loans' => Loan::count(),
            'active_loans' => Loan::active()->count(),
            'completed_loans' => Loan::completed()->count(),
            'defaulted_loans' => Loan::defaulted()->count(),
            'total_interest_earned' => Loan::completed()->sum(DB::raw('total_amount - principal_amount')),
        ];

        // Investment performance
        $investmentStats = [
            'total_investments' => CicInvestment::count(),
            'active_investments' => CicInvestment::active()->count(),
            'total_value' => CicInvestment::active()->sum('current_value'),
            'total_interest_distributed' => InterestDistribution::where('status', 'distributed')->sum('amount'),
        ];

        return inertia('reports/financial-summary', compact(
            'monthlyContributions',
            'loanStats',
            'investmentStats'
        ));
    }

        public function investmentsReport()
    {
        $investments = CicInvestment::with('recordedBy')
            ->latest()
            ->paginate(20);

        $investmentStats = [
            'total_investments' => CicInvestment::count(),
            'active_investments' => CicInvestment::active()->count(),
            'total_value' => CicInvestment::active()->sum('current_value'),
            'total_interest_distributed' => InterestDistribution::where('status', 'distributed')->sum('amount'),
        ];

        return inertia('reports/investments', compact('investments', 'investmentStats'));
    }

        public function myContributions()
    {
        $user = Auth::user();

        $contributions = $user->contributions()
            ->with(['user:id,name,email', 'approvedBy:id,name'])
            ->latest()
            ->paginate(20);

        $totalContributions = $user->contributions()
            ->approved()
            ->where('type', 'deposit')
            ->sum('amount');

        $totalWithdrawals = $user->contributions()
            ->approved()
            ->where('type', 'withdrawal')
            ->sum('amount');

        $netContributions = $totalContributions - $totalWithdrawals;

        // Calculate potential CIC interest (9.75% monthly)
        $potentialMonthlyInterest = ($netContributions * 9.75) / 100;
        $potentialYearlyInterest = $potentialMonthlyInterest * 12;

        return inertia('contributions/my-contributions', compact(
            'contributions',
            'totalContributions',
            'totalWithdrawals',
            'netContributions',
            'potentialMonthlyInterest',
            'potentialYearlyInterest'
        ));
    }

    public function calculateCicInterest()
    {
        $this->authorize('viewReports', User::class);

        $totalContributions = MemberContribution::approved()
            ->where('type', 'deposit')
            ->sum('amount');

        $totalWithdrawals = MemberContribution::approved()
            ->where('type', 'withdrawal')
            ->sum('amount');

        $netContributions = $totalContributions - $totalWithdrawals;

        // Calculate potential CIC interest (9.75% monthly)
        $potentialMonthlyInterest = ($netContributions * 9.75) / 100;
        $potentialYearlyInterest = $potentialMonthlyInterest * 12;

        $activeMembers = User::active()->count();
        $interestPerMember = $activeMembers > 0 ? $potentialMonthlyInterest / $activeMembers : 0;

        return inertia('reports/cic-interest', compact(
            'totalContributions',
            'totalWithdrawals',
            'netContributions',
            'potentialMonthlyInterest',
            'potentialYearlyInterest',
            'activeMembers',
            'interestPerMember'
        ));
    }
}
