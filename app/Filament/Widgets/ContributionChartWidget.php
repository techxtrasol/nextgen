<?php

namespace App\Filament\Widgets;

use App\Models\MemberContribution;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class ContributionChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Monthly Contributions';

    protected function getData(): array
    {
        $data = MemberContribution::where('type', 'deposit')
            ->where('status', 'approved')
            ->selectRaw('strftime("%Y", transaction_date) as year, strftime("%m", transaction_date) as month, SUM(amount) as total')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        $labels = [];
        $values = [];

        foreach ($data->reverse() as $item) {
            $date = Carbon::createFromDate($item->year, $item->month, 1);
            $labels[] = $date->format('M Y');
            $values[] = $item->total;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Contributions (KSH)',
                    'data' => $values,
                    'backgroundColor' => '#10b981',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
