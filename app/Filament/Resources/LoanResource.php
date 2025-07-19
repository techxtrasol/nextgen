<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LoanResource\Pages;
use App\Models\Loan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Grid;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\Placeholder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class LoanResource extends Resource
{
    protected static ?string $model = Loan::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $navigationGroup = 'Financial Management';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Loan Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('principal_amount')
                                    ->label('Principal Amount (KSH)')
                                    ->numeric()
                                    ->required()
                                    ->prefix('KSH'),
                                Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'approved' => 'Approved',
                                        'active' => 'Active',
                                        'completed' => 'Completed',
                                        'rejected' => 'Rejected',
                                        'defaulted' => 'Defaulted',
                                    ])
                                    ->required(),
                            ]),
                        Grid::make(2)
                            ->schema([
                                Select::make('repayment_period')
                                    ->options([
                                        3 => '3 Months',
                                        6 => '6 Months',
                                        12 => '12 Months',
                                        18 => '18 Months',
                                        24 => '24 Months',
                                    ])
                                    ->required(),
                                DatePicker::make('application_date')
                                    ->label('Application Date')
                                    ->required(),
                            ]),
                        Textarea::make('purpose')
                            ->label('Loan Purpose')
                            ->required()
                            ->rows(3),
                        Textarea::make('collateral_description')
                            ->label('Collateral Description')
                            ->rows(2),
                    ])
                    ->columns(1),

                Section::make('Guarantor Information')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('guarantor_name')
                                    ->label('Guarantor Name')
                                    ->required(),
                                TextInput::make('guarantor_phone')
                                    ->label('Phone Number')
                                    ->required(),
                                TextInput::make('guarantor_relationship')
                                    ->label('Relationship')
                                    ->required(),
                            ]),
                    ])
                    ->columns(1),

                Section::make('Approval Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                DatePicker::make('approval_date')
                                    ->label('Approval Date'),
                                DatePicker::make('due_date')
                                    ->label('Due Date'),
                            ]),
                        Textarea::make('notes')
                            ->label('Admin Notes')
                            ->rows(3),
                    ])
                    ->columns(1)
                    ->collapsible()
                    ->collapsed(),

                Section::make('Payment Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Placeholder::make('total_paid')
                                    ->label('Total Paid')
                                    ->content(function (Model $record): string {
                                        if (!$record) return 'N/A';
                                        return 'KSH ' . number_format($record->payments()->sum('amount'), 2);
                                    }),
                                Placeholder::make('balance')
                                    ->label('Balance')
                                    ->content(function (Model $record): string {
                                        if (!$record) return 'N/A';
                                        return 'KSH ' . number_format($record->balance, 2);
                                    }),
                            ]),
                    ])
                    ->columns(1)
                    ->collapsible()
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('Member')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('principal_amount')
                    ->label('Amount')
                    ->money('KSH')
                    ->sortable(),
                BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'info' => 'active',
                        'danger' => 'rejected',
                        'gray' => 'defaulted',
                        'success' => 'completed',
                    ]),
                TextColumn::make('repayment_period')
                    ->label('Period')
                    ->formatStateUsing(fn (string $state): string => $state . ' months'),
                TextColumn::make('application_date')
                    ->label('Applied')
                    ->date()
                    ->sortable(),
                TextColumn::make('due_date')
                    ->label('Due Date')
                    ->date()
                    ->sortable(),
                TextColumn::make('balance')
                    ->label('Balance')
                    ->money('KSH')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'active' => 'Active',
                        'completed' => 'Completed',
                        'rejected' => 'Rejected',
                        'defaulted' => 'Defaulted',
                    ]),
                Filter::make('overdue')
                    ->query(fn (Builder $query): Builder => $query->where('due_date', '<', now())->where('status', 'active'))
                    ->label('Overdue Loans'),
            ])
            ->actions([
                Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(function (Loan $record) {
                        $record->update([
                            'status' => 'approved',
                            'approval_date' => now(),
                            'approved_by' => auth()->id(),
                            'due_date' => now()->addMonths($record->repayment_period),
                        ]);
                    })
                    ->visible(fn (Loan $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Approve Loan')
                    ->modalDescription('Are you sure you want to approve this loan application?')
                    ->modalSubmitActionLabel('Yes, approve'),
                Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->action(function (Loan $record) {
                        $record->update([
                            'status' => 'rejected',
                            'approved_by' => auth()->id(),
                        ]);
                    })
                    ->visible(fn (Loan $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Reject Loan')
                    ->modalDescription('Are you sure you want to reject this loan application?')
                    ->modalSubmitActionLabel('Yes, reject'),
                Action::make('activate')
                    ->label('Activate')
                    ->icon('heroicon-o-play-circle')
                    ->color('info')
                    ->action(function (Loan $record) {
                        $record->update([
                            'status' => 'active',
                        ]);
                    })
                    ->visible(fn (Loan $record) => $record->status === 'approved')
                    ->requiresConfirmation()
                    ->modalHeading('Activate Loan')
                    ->modalDescription('Are you sure you want to activate this loan?')
                    ->modalSubmitActionLabel('Yes, activate'),
            ])
            ->bulkActions([
                BulkAction::make('approve_selected')
                    ->label('Approve Selected')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(function ($records) {
                        $records->each(function ($record) {
                            if ($record->status === 'pending') {
                                $record->update([
                                    'status' => 'approved',
                                    'approval_date' => now(),
                                    'approved_by' => auth()->id(),
                                    'due_date' => now()->addMonths($record->repayment_period),
                                ]);
                            }
                        });
                    })
                    ->requiresConfirmation()
                    ->modalHeading('Approve Selected Loans')
                    ->modalDescription('Are you sure you want to approve the selected loans?')
                    ->modalSubmitActionLabel('Yes, approve'),
                BulkAction::make('reject_selected')
                    ->label('Reject Selected')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->action(function ($records) {
                        $records->each(function ($record) {
                            if ($record->status === 'pending') {
                                $record->update([
                                    'status' => 'rejected',
                                    'approved_by' => auth()->id(),
                                ]);
                            }
                        });
                    })
                    ->requiresConfirmation()
                    ->modalHeading('Reject Selected Loans')
                    ->modalDescription('Are you sure you want to reject the selected loans?')
                    ->modalSubmitActionLabel('Yes, reject'),
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
            'index' => Pages\ListLoans::route('/'),
            'create' => Pages\CreateLoan::route('/create'),
            'edit' => Pages\EditLoan::route('/{record}/edit'),
            'view' => Pages\ViewLoan::route('/{record}'),
        ];
    }
}
