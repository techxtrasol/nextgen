<?php

namespace App\Filament\Widgets;

use App\Models\MemberContribution;
use Filament\Widgets\TableWidget;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;

class RecentContributionsWidget extends TableWidget
{
    protected static ?string $heading = 'Recent Contributions';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                MemberContribution::query()
                    ->with('user')
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                TextColumn::make('user.name')
                    ->label('Member')
                    ->searchable(),
                TextColumn::make('amount')
                    ->money('KSH')
                    ->sortable(),
                BadgeColumn::make('type')
                    ->colors([
                        'success' => 'deposit',
                        'warning' => 'withdrawal',
                        'info' => 'interest',
                    ]),
                BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ]),
                TextColumn::make('transaction_date')
                    ->dateTime()
                    ->sortable(),
            ]);
    }
}
