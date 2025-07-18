<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CicInvestmentResource\Pages;
use App\Models\CicInvestment;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CicInvestmentResource extends Resource
{
    protected static ?string $model = CicInvestment::class;

    protected static ?string $navigationIcon = 'heroicon-o-chart-pie';

    protected static ?string $navigationGroup = 'Investments';

    protected static ?string $navigationLabel = 'CIC Investments';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Investment Details')
                    ->schema([
                        Forms\Components\TextInput::make('amount')
                            ->required()
                            ->numeric()
                            ->prefix('KSH')
                            ->minValue(10000),
                        Forms\Components\DatePicker::make('investment_date')
                            ->required()
                            ->default(today()),
                        Forms\Components\TextInput::make('interest_rate')
                            ->required()
                            ->numeric()
                            ->suffix('%')
                            ->default(9.75)
                            ->minValue(0)
                            ->maxValue(50),
                        Forms\Components\TextInput::make('current_value')
                            ->required()
                            ->numeric()
                            ->prefix('KSH')
                            ->default(fn (callable $get) => $get('amount')),
                        Forms\Components\DatePicker::make('maturity_date')
                            ->afterOrEqual('investment_date'),
                        Forms\Components\TextInput::make('investment_reference')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->default(fn () => 'CIC-' . strtoupper(uniqid())),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Status & Notes')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'matured' => 'Matured',
                                'withdrawn' => 'Withdrawn',
                            ])
                            ->default('active')
                            ->required(),
                        Forms\Components\Textarea::make('notes')
                            ->columnSpanFull(),
                        Forms\Components\Select::make('recorded_by')
                            ->label('Recorded By')
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
                Tables\Columns\TextColumn::make('investment_reference')
                    ->label('Reference')
                    ->searchable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('amount')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('current_value')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('interest_earned')
                    ->label('Interest Earned')
                    ->money('KSH')
                    ->getStateUsing(fn ($record) => $record->current_value - $record->amount)
                    ->color('success'),
                Tables\Columns\TextColumn::make('interest_rate')
                    ->suffix('%')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'primary' => 'active',
                        'success' => 'matured',
                        'warning' => 'withdrawn',
                    ]),
                Tables\Columns\TextColumn::make('investment_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('maturity_date')
                    ->date()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('recordedBy.name')
                    ->label('Recorded By')
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
                        'matured' => 'Matured',
                        'withdrawn' => 'Withdrawn',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('updateValue')
                    ->label('Update Value')
                    ->icon('heroicon-o-currency-dollar')
                    ->form([
                        Forms\Components\TextInput::make('current_value')
                            ->label('Current Value')
                            ->numeric()
                            ->prefix('KSH')
                            ->required(),
                    ])
                    ->action(function (array $data, CicInvestment $record): void {
                        $record->update(['current_value' => $data['current_value']]);
                    }),
                Tables\Actions\Action::make('distributeInterest')
                    ->label('Distribute Interest')
                    ->icon('heroicon-o-share')
                    ->form([
                        Forms\Components\TextInput::make('interest_amount')
                            ->label('Interest Amount to Distribute')
                            ->numeric()
                            ->prefix('KSH')
                            ->required(),
                        Forms\Components\DatePicker::make('distribution_date')
                            ->label('Distribution Date')
                            ->default(today())
                            ->required(),
                    ])
                    ->action(function (array $data, CicInvestment $record): void {
                        // This would trigger the interest distribution logic
                        // Implementation would be in the controller
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCicInvestments::route('/'),
            'create' => Pages\CreateCicInvestment::route('/create'),
            'view' => Pages\ViewCicInvestment::route('/{record}'),
            'edit' => Pages\EditCicInvestment::route('/{record}/edit'),
        ];
    }
}