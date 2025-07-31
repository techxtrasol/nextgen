<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InterestDistributionResource\Pages;
use App\Models\InterestDistribution;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Illuminate\Database\Eloquent\Builder;

class InterestDistributionResource extends Resource
{
    protected static ?string $model = InterestDistribution::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationGroup = 'Financial Management';

    protected static ?string $navigationLabel = 'Interest Distributions';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Distribution Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                DatePicker::make('distribution_month')
                                    ->label('Distribution Month')
                                    ->required()
                                    ->displayFormat('F Y')
                                    ->native(false),

                                DatePicker::make('distribution_date')
                                    ->label('Distribution Date')
                                    ->required()
                                    ->native(false),
                            ]),

                        Grid::make(2)
                            ->schema([
                                TextInput::make('total_interest_earned')
                                    ->label('Total Interest Earned (KES)')
                                    ->numeric()
                                    ->required()
                                    ->prefix('KES')
                                    ->minValue(0),

                                TextInput::make('interest_rate')
                                    ->label('Interest Rate (%)')
                                    ->numeric()
                                    ->required()
                                    ->suffix('%')
                                    ->minValue(0)
                                    ->maxValue(50)
                                    ->default(9.75),
                            ]),

                        Grid::make(3)
                            ->schema([
                                Placeholder::make('management_fee')
                                    ->label('Management Fee (2% annually)')
                                    ->content(function (Get $get): string {
                                        $totalInterest = $get('total_interest_earned') ?? 0;
                                        $monthlyFee = $totalInterest * (0.02 / 12);
                                        return 'KES ' . number_format($monthlyFee, 2);
                                    }),

                                Placeholder::make('withholding_tax')
                                    ->label('Withholding Tax (15%)')
                                    ->content(function (Get $get): string {
                                        $totalInterest = $get('total_interest_earned') ?? 0;
                                        $tax = $totalInterest * 0.15;
                                        return 'KES ' . number_format($tax, 2);
                                    }),

                                Placeholder::make('net_interest')
                                    ->label('Net Interest Distributed')
                                    ->content(function (Get $get): string {
                                        $totalInterest = $get('total_interest_earned') ?? 0;
                                        $monthlyFee = $totalInterest * (0.02 / 12);
                                        $tax = $totalInterest * 0.15;
                                        $netInterest = $totalInterest - $monthlyFee - $tax;
                                        return 'KES ' . number_format($netInterest, 2);
                                    }),
                            ]),

                        Grid::make(2)
                            ->schema([
                                TextInput::make('member_count')
                                    ->label('Number of Active Members')
                                    ->numeric()
                                    ->required()
                                    ->minValue(1),

                                Placeholder::make('interest_per_member')
                                    ->label('Interest Per Member')
                                    ->content(function (Get $get): string {
                                        $totalInterest = $get('total_interest_earned') ?? 0;
                                        $memberCount = $get('member_count') ?? 1;
                                        $monthlyFee = $totalInterest * (0.02 / 12);
                                        $tax = $totalInterest * 0.15;
                                        $netInterest = $totalInterest - $monthlyFee - $tax;
                                        $perMember = $netInterest / $memberCount;
                                        return 'KES ' . number_format($perMember, 2);
                                    }),
                            ]),

                        Textarea::make('notes')
                            ->label('Notes')
                            ->rows(3)
                            ->placeholder('Additional notes about this distribution...'),
                    ])
                    ->columns(1),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('distribution_month')
                    ->label('Month')
                    ->date('F Y')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('distribution_date')
                    ->label('Distribution Date')
                    ->dateTime('M d, Y')
                    ->sortable(),

                TextColumn::make('total_interest_earned')
                    ->label('Total Interest')
                    ->money('KES')
                    ->sortable(),

                TextColumn::make('interest_rate')
                    ->label('Rate')
                    ->suffix('%')
                    ->sortable(),

                TextColumn::make('management_fee')
                    ->label('Management Fee')
                    ->money('KES')
                    ->sortable(),

                TextColumn::make('withholding_tax')
                    ->label('Withholding Tax')
                    ->money('KES')
                    ->sortable(),

                TextColumn::make('net_interest_distributed')
                    ->label('Net Distributed')
                    ->money('KES')
                    ->sortable(),

                TextColumn::make('member_count')
                    ->label('Members')
                    ->sortable(),

                TextColumn::make('interest_per_member')
                    ->label('Per Member')
                    ->money('KES')
                    ->sortable(),

                TextColumn::make('processedBy.name')
                    ->label('Processed By')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('year')
                    ->label('Year')
                    ->options(function () {
                        return InterestDistribution::selectRaw('YEAR(distribution_month) as year')
                            ->distinct()
                            ->pluck('year', 'year')
                            ->toArray();
                    })
                    ->query(function (Builder $query, array $data): Builder {
                        return $query->when($data['value'], function (Builder $query, $year): Builder {
                            return $query->whereYear('distribution_month', $year);
                        });
                    }),

                Filter::make('recent')
                    ->label('Recent Distributions')
                    ->query(fn (Builder $query): Builder => $query->where('distribution_date', '>=', now()->subMonths(6))),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('distribution_date', 'desc');
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
            'index' => Pages\ListInterestDistributions::route('/'),
            'create' => Pages\CreateInterestDistribution::route('/create'),
            'view' => Pages\ViewInterestDistribution::route('/{record}'),
        ];
    }
}
