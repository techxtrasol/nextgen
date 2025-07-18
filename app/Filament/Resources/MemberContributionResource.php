<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MemberContributionResource\Pages;
use App\Models\MemberContribution;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class MemberContributionResource extends Resource
{
    protected static ?string $model = MemberContribution::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationGroup = 'Welfare Management';

    protected static ?string $navigationLabel = 'Contributions';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Contribution Details')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Member')
                            ->options(User::active()->pluck('name', 'id'))
                            ->required()
                            ->searchable(),
                        Forms\Components\TextInput::make('amount')
                            ->required()
                            ->numeric()
                            ->prefix('KSH')
                            ->minValue(100),
                        Forms\Components\Select::make('type')
                            ->options([
                                'deposit' => 'Deposit',
                                'withdrawal' => 'Withdrawal',
                                'interest' => 'Interest',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('reference_number')
                            ->required()
                            ->unique(ignoreRecord: true),
                        Forms\Components\Textarea::make('description')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Status & Approval')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->required(),
                        Forms\Components\DateTimePicker::make('transaction_date')
                            ->required(),
                        Forms\Components\Select::make('approved_by')
                            ->label('Approved By')
                            ->options(User::whereIn('role', ['admin', 'treasurer'])->pluck('name', 'id'))
                            ->searchable()
                            ->visible(fn (callable $get) => $get('status') !== 'pending'),
                        Forms\Components\DateTimePicker::make('approved_at')
                            ->visible(fn (callable $get) => $get('status') !== 'pending'),
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
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('amount')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('type')
                    ->colors([
                        'success' => 'deposit',
                        'warning' => 'withdrawal',
                        'info' => 'interest',
                    ]),
                Tables\Columns\TextColumn::make('reference_number')
                    ->searchable()
                    ->copyable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ]),
                Tables\Columns\TextColumn::make('transaction_date')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('approvedBy.name')
                    ->label('Approved By')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'deposit' => 'Deposit',
                        'withdrawal' => 'Withdrawal',
                        'interest' => 'Interest',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListMemberContributions::route('/'),
            'create' => Pages\CreateMemberContribution::route('/create'),
            'view' => Pages\ViewMemberContribution::route('/{record}'),
            'edit' => Pages\EditMemberContribution::route('/{record}/edit'),
        ];
    }
}