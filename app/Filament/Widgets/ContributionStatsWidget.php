<?php

namespace App\Filament\Widgets;

use App\Models\MemberContribution;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContributionStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalContributions = MemberContribution::where('type', 'deposit')->where('status', 'approved')->sum('amount');
        $totalWithdrawals = MemberContribution::where('type', 'withdrawal')->where('status', 'approved')->sum('amount');
        $netContributions = $totalContributions - $totalWithdrawals;
        $pendingContributions = MemberContribution::where('status', 'pending')->count();
        $activeMembers = User::active()->count();

        return [
            Stat::make('Total Approved Deposits', 'KSH ' . number_format($totalContributions, 2))
                ->description('All time approved deposits')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('Total Approved Withdrawals', 'KSH ' . number_format($totalWithdrawals, 2))
                ->description('All time approved withdrawals')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('warning'),
            Stat::make('Net Contributions', 'KSH ' . number_format($netContributions, 2))
                ->description('Current balance')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color($netContributions >= 0 ? 'success' : 'danger'),
            Stat::make('Pending Approvals', $pendingContributions)
                ->description('Awaiting approval')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
            Stat::make('Active Members', $activeMembers)
                ->description('Total active members')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),
        ];
    }
}
