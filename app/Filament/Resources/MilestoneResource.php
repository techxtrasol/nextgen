<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MilestoneResource\Pages;
use App\Models\Milestone;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class MilestoneResource extends Resource
{
    protected static ?string $model = Milestone::class;

    protected static ?string $navigationIcon = 'heroicon-o-flag';

    protected static ?string $navigationGroup = 'Welfare Management';

    protected static ?string $navigationLabel = 'Milestones';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Milestone Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('target_amount')
                            ->required()
                            ->numeric()
                            ->prefix('KSH')
                            ->minValue(1000),
                        Forms\Components\TextInput::make('current_amount')
                            ->numeric()
                            ->prefix('KSH')
                            ->default(0)
                            ->minValue(0),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Timeline & Status')
                    ->schema([
                        Forms\Components\DatePicker::make('target_date')
                            ->required()
                            ->afterOrEqual(today()),
                        Forms\Components\DatePicker::make('achieved_date')
                            ->visible(fn (callable $get) => $get('status') === 'achieved'),
                        Forms\Components\Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'achieved' => 'Achieved',
                                'paused' => 'Paused',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('active')
                            ->required(),
                        Forms\Components\Select::make('priority')
                            ->options([
                                'low' => 'Low',
                                'medium' => 'Medium',
                                'high' => 'High',
                                'critical' => 'Critical',
                            ])
                            ->default('medium')
                            ->required(),
                        Forms\Components\Select::make('created_by')
                            ->label('Created By')
                            ->options(User::whereIn('role', ['admin', 'treasurer'])->pluck('name', 'id'))
                            ->required()
                            ->searchable(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('target_amount')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('current_amount')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('progress_percentage')
                    ->label('Progress')
                    ->formatStateUsing(fn ($state) => number_format($state, 1) . '%')
                    ->color(fn ($state) => match (true) {
                        $state >= 100 => 'success',
                        $state >= 75 => 'info',
                        $state >= 50 => 'warning',
                        default => 'danger',
                    }),
                Tables\Columns\BadgeColumn::make('priority')
                    ->colors([
                        'gray' => 'low',
                        'warning' => 'medium',
                        'primary' => 'high',
                        'danger' => 'critical',
                    ]),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'primary' => 'active',
                        'success' => 'achieved',
                        'warning' => 'paused',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('target_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('achieved_date')
                    ->date()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('createdBy.name')
                    ->label('Created By')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'achieved' => 'Achieved',
                        'paused' => 'Paused',
                        'cancelled' => 'Cancelled',
                    ]),
                Tables\Filters\SelectFilter::make('priority')
                    ->options([
                        'low' => 'Low',
                        'medium' => 'Medium',
                        'high' => 'High',
                        'critical' => 'Critical',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('updateProgress')
                    ->label('Update Progress')
                    ->icon('heroicon-o-chart-bar')
                    ->form([
                        Forms\Components\TextInput::make('current_amount')
                            ->label('Current Amount')
                            ->numeric()
                            ->prefix('KSH')
                            ->required(),
                    ])
                    ->action(function (array $data, Milestone $record): void {
                        $record->update(['current_amount' => $data['current_amount']]);
                        
                        // Check if milestone is achieved
                        if ($record->current_amount >= $record->target_amount) {
                            $record->update([
                                'status' => 'achieved',
                                'achieved_date' => now(),
                            ]);
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMilestones::route('/'),
            'create' => Pages\CreateMilestone::route('/create'),
            'view' => Pages\ViewMilestone::route('/{record}'),
            'edit' => Pages\EditMilestone::route('/{record}/edit'),
        ];
    }
}