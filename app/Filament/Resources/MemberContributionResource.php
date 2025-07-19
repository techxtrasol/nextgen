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
use Illuminate\Database\Eloquent\Model;

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
                            ->searchable()
                            ->disabled(fn ($record) => $record && $record->status !== 'pending'),
                        Forms\Components\TextInput::make('amount')
                            ->required()
                            ->numeric()
                            ->prefix('KSH')
                            ->minValue(100)
                            ->disabled(fn ($record) => $record && $record->status !== 'pending'),
                        Forms\Components\Select::make('type')
                            ->options([
                                'deposit' => 'Deposit',
                                'withdrawal' => 'Withdrawal',
                                'interest' => 'Interest',
                            ])
                            ->required()
                            ->disabled(fn ($record) => $record && $record->status !== 'pending'),
                        Forms\Components\TextInput::make('reference_number')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->disabled(fn ($record) => $record && $record->status !== 'pending'),
                        Forms\Components\Textarea::make('description')
                            ->columnSpanFull()
                            ->disabled(fn ($record) => $record && $record->status !== 'pending'),
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
                            ->required()
                            ->disabled(fn ($record) => $record && $record->status !== 'pending'),
                        Forms\Components\DateTimePicker::make('transaction_date')
                            ->required()
                            ->disabled(fn ($record) => $record && $record->status !== 'pending'),
                        Forms\Components\Select::make('approved_by')
                            ->label('Approved By')
                            ->options(User::whereIn('role', ['admin', 'treasurer'])->pluck('name', 'id'))
                            ->searchable()
                            ->visible(fn (callable $get) => $get('status') !== 'pending')
                            ->disabled(),
                        Forms\Components\DateTimePicker::make('approved_at')
                            ->visible(fn (callable $get) => $get('status') !== 'pending')
                            ->disabled(),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Approval Information')
                    ->schema([
                        Forms\Components\Placeholder::make('approval_note')
                            ->label('Approval Note')
                            ->content('Use the Approve/Reject buttons in the header to approve or reject this contribution. This will automatically update the member\'s total contributions and loan limit.')
                            ->visible(fn ($record) => $record && $record->status === 'pending'),
                    ])
                    ->visible(fn ($record) => $record && $record->status === 'pending'),
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
                Tables\Columns\TextColumn::make('approved_at')
                    ->label('Approved At')
                    ->dateTime()
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
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('Member')
                    ->options(User::active()->pluck('name', 'id'))
                    ->searchable(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('quick_approve')
                    ->label('Quick Approve')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->action(function (MemberContribution $record) {
                        $record->update([
                            'status' => 'approved',
                            'approved_by' => auth()->id(),
                            'approved_at' => now(),
                        ]);

                        // Update user's total contributions and loan limit
                        $user = $record->user;
                        if ($record->type === 'deposit') {
                            $user->increment('total_contributions', $record->amount);
                            $user->increment('available_loan_limit', $record->amount);
                        } else {
                            $user->decrement('total_contributions', $record->amount);
                            $user->decrement('available_loan_limit', $record->amount);
                        }
                    })
                    ->visible(fn (MemberContribution $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Quick Approve')
                    ->modalDescription('Are you sure you want to approve this contribution?')
                    ->modalSubmitActionLabel('Yes, approve'),
                Tables\Actions\Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (MemberContribution $record) {
                        $record->update([
                            'status' => 'approved',
                            'approved_by' => auth()->id(),
                            'approved_at' => now(),
                        ]);

                        // Update user's total contributions and loan limit
                        $user = $record->user;
                        if ($record->type === 'deposit') {
                            $user->increment('total_contributions', $record->amount);
                            $user->increment('available_loan_limit', $record->amount);
                        } else {
                            $user->decrement('total_contributions', $record->amount);
                            $user->decrement('available_loan_limit', $record->amount);
                        }
                    })
                    ->visible(fn (MemberContribution $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Approve Contribution')
                    ->modalDescription('Are you sure you want to approve this contribution? This will update the member\'s total contributions and loan limit.')
                    ->modalSubmitActionLabel('Yes, approve'),
                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (MemberContribution $record) {
                        $record->update([
                            'status' => 'rejected',
                            'approved_by' => auth()->id(),
                            'approved_at' => now(),
                        ]);
                    })
                    ->visible(fn (MemberContribution $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Reject Contribution')
                    ->modalDescription('Are you sure you want to reject this contribution?')
                    ->modalSubmitActionLabel('Yes, reject'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->action(function ($records) {
                            foreach ($records as $record) {
                                if ($record->status === 'pending') {
                                    $record->update([
                                        'status' => 'approved',
                                        'approved_by' => auth()->id(),
                                        'approved_at' => now(),
                                    ]);

                                    // Update user's total contributions and loan limit
                                    $user = $record->user;
                                    if ($record->type === 'deposit') {
                                        $user->increment('total_contributions', $record->amount);
                                        $user->increment('available_loan_limit', $record->amount);
                                    } else {
                                        $user->decrement('total_contributions', $record->amount);
                                        $user->decrement('available_loan_limit', $record->amount);
                                    }
                                }
                            }
                        })
                        ->requiresConfirmation()
                        ->modalHeading('Approve Selected Contributions')
                        ->modalDescription('Are you sure you want to approve the selected contributions? This will update the members\' total contributions and loan limits.')
                        ->modalSubmitActionLabel('Yes, approve selected'),
                    Tables\Actions\BulkAction::make('reject_selected')
                        ->label('Reject Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->action(function ($records) {
                            foreach ($records as $record) {
                                if ($record->status === 'pending') {
                                    $record->update([
                                        'status' => 'rejected',
                                        'approved_by' => auth()->id(),
                                        'approved_at' => now(),
                                    ]);
                                }
                            }
                        })
                        ->requiresConfirmation()
                        ->modalHeading('Reject Selected Contributions')
                        ->modalDescription('Are you sure you want to reject the selected contributions?')
                        ->modalSubmitActionLabel('Yes, reject selected'),
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

    public static function canViewAny(): bool
    {
        return true; // All authenticated users can view contributions
    }

    public static function canView(Model $record): bool
    {
        $user = auth()->user();
        return $user->isAdmin() || $user->isTreasurer() || $user->id === $record->user_id;
    }

    public static function canCreate(): bool
    {
        return true; // All authenticated users can create contributions
    }

    public static function canEdit(Model $record): bool
    {
        $user = auth()->user();
        return $user->isAdmin() || $user->isTreasurer();
    }

    public static function canDelete(Model $record): bool
    {
        $user = auth()->user();
        return $user->isAdmin() || $user->isTreasurer();
    }
}
