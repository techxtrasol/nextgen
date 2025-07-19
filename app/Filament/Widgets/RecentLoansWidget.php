<?php

namespace App\Filament\Widgets;

use App\Models\Loan;
use Filament\Widgets\TableWidget;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;

class RecentLoansWidget extends TableWidget
{
    protected static ?string $heading = 'Recent Loans';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Loan::query()
                    ->with('user')
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                TextColumn::make('user.name')
                    ->label('Member')
                    ->searchable(),
                TextColumn::make('principal_amount')
                    ->money('KSH')
                    ->sortable(),
                BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'active',
                        'danger' => 'defaulted',
                        'info' => 'completed',
                    ]),
                TextColumn::make('application_date')
                    ->date()
                    ->sortable(),
            ]);
    }
}
