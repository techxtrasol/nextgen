<?php

namespace App\Filament\Widgets;

use App\Models\Milestone;
use Filament\Widgets\TableWidget;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;

class MilestoneProgressWidget extends TableWidget
{
    protected static ?string $heading = 'Milestone Progress';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Milestone::query()
                    ->with('createdBy')
                    ->where('status', 'active')
                    ->orderBy('target_date')
                    ->limit(5)
            )
            ->columns([
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('current_amount')
                    ->money('KSH')
                    ->sortable(),
                TextColumn::make('target_amount')
                    ->money('KSH')
                    ->sortable(),
                BadgeColumn::make('priority')
                    ->colors([
                        'success' => 'low',
                        'warning' => 'medium',
                        'danger' => 'high',
                        'gray' => 'critical',
                    ]),
                TextColumn::make('target_date')
                    ->date()
                    ->sortable(),
            ]);
    }
}
