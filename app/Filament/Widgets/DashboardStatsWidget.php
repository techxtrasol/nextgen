<?php

namespace App\Filament\Widgets;

use App\Models\MemberContribution;
use App\Models\User;
use App\Models\Loan;
use App\Models\CicInvestment;
use App\Models\Milestone;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalMembers = User::active()->count();
        $totalContributions = MemberContribution::where('type', 'deposit')->where('status', 'approved')->sum('amount');
        $totalWithdrawals = MemberContribution::where('type', 'withdrawal')->where('status', 'approved')->sum('amount');
        $netContributions = $totalContributions - $totalWithdrawals;
        $pendingContributions = MemberContribution::where('status', 'pending')->count();
        $activeLoans = Loan::where('status', 'active')->count();
        $totalLoans = Loan::where('status', '!=', 'rejected')->sum('principal_amount');
        $totalInvestments = CicInvestment::active()->sum('current_value');
        $activeMilestones = Milestone::active()->count();

        return [
            Stat::make('Active Members', $totalMembers)
                ->description('Total active members')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),
            Stat::make('Net Contributions', 'KSH ' . number_format($netContributions, 2))
                ->description('Total deposits minus withdrawals')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color($netContributions >= 0 ? 'success' : 'danger'),
            Stat::make('Pending Approvals', $pendingContributions)
                ->description('Contributions awaiting approval')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
            Stat::make('Active Loans', $activeLoans)
                ->description('Currently active loans')
                ->descriptionIcon('heroicon-m-credit-card')
                ->color('info'),
            Stat::make('Total Loans Issued', 'KSH ' . number_format($totalLoans, 2))
                ->description('All time loan amount')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            Stat::make('CIC Investments', 'KSH ' . number_format($totalInvestments, 2))
                ->description('Current investment value')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('purple'),
            Stat::make('Active Milestones', $activeMilestones)
                ->description('Ongoing milestones')
                ->descriptionIcon('heroicon-m-flag')
                ->color('warning'),
        ];
    }
}
