<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LoanResource\Pages;
use App\Models\Loan;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class LoanResource extends Resource
{
    protected static ?string $model = Loan::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $navigationGroup = 'Welfare Management';

    protected static ?string $navigationLabel = 'Loans';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Loan Information')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Member')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\TextInput::make('principal_amount')
                            ->label('Principal Amount (KSh)')
                            ->numeric()
                            ->prefix('KSh')
                            ->required()
                            ->minValue(100),
                        Forms\Components\Select::make('duration_weeks')
                            ->label('Duration (Weeks)')
                            ->options([
                                1 => '1 Week (5% interest)',
                                2 => '2 Weeks (10% interest)',
                                3 => '3 Weeks (15% interest)',
                                4 => '4 Weeks (20% interest)',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('purpose')
                            ->required()
                            ->rows(3),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Loan Terms')
                    ->schema([
                        Forms\Components\TextInput::make('interest_rate')
                            ->label('Interest Rate (%)')
                            ->numeric()
                            ->suffix('%')
                            ->disabled(),
                        Forms\Components\TextInput::make('total_amount')
                            ->label('Total Amount (KSh)')
                            ->numeric()
                            ->prefix('KSh')
                            ->disabled(),
                        Forms\Components\TextInput::make('balance')
                            ->label('Outstanding Balance (KSh)')
                            ->numeric()
                            ->prefix('KSh')
                            ->disabled(),
                        Forms\Components\TextInput::make('amount_paid')
                            ->label('Amount Paid (KSh)')
                            ->numeric()
                            ->prefix('KSh')
                            ->disabled(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Status & Dates')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'active' => 'Active',
                                'completed' => 'Completed',
                                'defaulted' => 'Defaulted',
                                'rejected' => 'Rejected',
                            ])
                            ->required(),
                        Forms\Components\DatePicker::make('application_date')
                            ->required()
                            ->default(now()),
                        Forms\Components\DatePicker::make('approval_date'),
                        Forms\Components\DatePicker::make('due_date'),
                        Forms\Components\DatePicker::make('completion_date'),
                        Forms\Components\Select::make('approved_by')
                            ->label('Approved By')
                            ->relationship('approvedBy', 'name')
                            ->searchable(),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Penalties & Notes')
                    ->schema([
                        Forms\Components\TextInput::make('penalty_days')
                            ->label('Penalty Days')
                            ->numeric()
                            ->default(0),
                        Forms\Components\TextInput::make('penalty_amount')
                            ->label('Penalty Amount (KSh)')
                            ->numeric()
                            ->prefix('KSh')
                            ->default(0),
                        Forms\Components\Textarea::make('notes')
                            ->rows(3),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Member')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('principal_amount')
                    ->label('Principal')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Total')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('balance')
                    ->label('Balance')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('duration_weeks')
                    ->label('Duration')
                    ->suffix(' weeks')
                    ->sortable(),
                Tables\Columns\TextColumn::make('interest_rate')
                    ->label('Interest')
                    ->suffix('%')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'primary' => 'active',
                        'success' => 'completed',
                        'danger' => 'defaulted',
                        'gray' => 'rejected',
                    ]),
                Tables\Columns\TextColumn::make('application_date')
                    ->label('Applied')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('due_date')
                    ->label('Due Date')
                    ->date()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'active' => 'Active',
                        'completed' => 'Completed',
                        'defaulted' => 'Defaulted',
                        'rejected' => 'Rejected',
                    ]),
                Tables\Filters\Filter::make('overdue')
                    ->query(fn (Builder $query): Builder => 
                        $query->where('status', 'active')
                              ->whereDate('due_date', '<', now())
                    )
                    ->label('Overdue Loans'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('application_date', 'desc');
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
        ];
    }
}