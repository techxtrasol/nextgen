<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use App\Notifications\UserApprovalNotification;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'Welfare Management';

    protected static ?string $navigationLabel = 'Members';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Personal Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone_number')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('id_number')
                            ->label('ID Number')
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\DatePicker::make('date_of_birth')
                            ->label('Date of Birth'),
                        Forms\Components\Textarea::make('address')
                            ->rows(3),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Welfare Information')
                    ->schema([
                        Forms\Components\Select::make('role')
                            ->options([
                                'member' => 'Member',
                                'admin' => 'Admin',
                                'treasurer' => 'Treasurer',
                            ])
                            ->required()
                            ->default('member'),
                        Forms\Components\DateTimePicker::make('joined_at')
                            ->label('Date Joined')
                            ->default(now()),
                        Forms\Components\TextInput::make('total_contributions')
                            ->label('Total Contributions (KSh)')
                            ->numeric()
                            ->prefix('KSh')
                            ->default(0),
                        Forms\Components\TextInput::make('available_loan_limit')
                            ->label('Available Loan Limit (KSh)')
                            ->numeric()
                            ->prefix('KSh')
                            ->default(0),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active Member')
                            ->default(true),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Approval Status')
                    ->schema([
                        Forms\Components\Toggle::make('email_verified')
                            ->label('Email Verified')
                            ->default(false),
                        Forms\Components\Toggle::make('admin_approved')
                            ->label('Admin Approved')
                            ->default(false),
                        Forms\Components\DateTimePicker::make('admin_approved_at')
                            ->label('Approved At')
                            ->visible(fn (string $context): bool => $context === 'edit'),
                        Forms\Components\Select::make('approval_status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->default('pending')
                            ->required(),
                        Forms\Components\Textarea::make('approval_notes')
                            ->label('Approval Notes')
                            ->rows(3)
                            ->placeholder('Add notes about approval decision...'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Account Security')
                    ->schema([
                        Forms\Components\TextInput::make('password')
                            ->password()
                            ->required(fn (string $context): bool => $context === 'create')
                            ->minLength(8)
                            ->dehydrated(fn ($state): bool => filled($state))
                            ->dehydrateStateUsing(fn ($state): string => bcrypt($state)),
                    ])
                    ->visibleOn('create'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('role')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'treasurer' => 'warning',
                        'member' => 'success',
                    }),
                Tables\Columns\IconColumn::make('email_verified')
                    ->boolean()
                    ->label('Email Verified'),
                Tables\Columns\IconColumn::make('admin_approved')
                    ->boolean()
                    ->label('Admin Approved'),
                Tables\Columns\TextColumn::make('approval_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                    }),
                Tables\Columns\TextColumn::make('joined_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        'admin' => 'Admin',
                        'member' => 'Member',
                        'treasurer' => 'Treasurer',
                    ]),
                Tables\Filters\SelectFilter::make('approval_status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),
                Tables\Filters\TernaryFilter::make('email_verified')
                    ->label('Email Verified'),
                Tables\Filters\TernaryFilter::make('admin_approved')
                    ->label('Admin Approved'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (User $record): bool => $record->approval_status === 'pending')
                    ->action(function (User $record) {
                        $record->update([
                            'admin_approved' => true,
                            'admin_approved_at' => now(),
                            'approval_status' => 'approved',
                            'is_active' => true,
                            'approved_by' => auth()->id(),
                        ]);

                        // Send approval notification
                        $record->notify(new UserApprovalNotification('approved'));

                        Notification::make()
                            ->title('User approved successfully')
                            ->success()
                            ->send();
                    }),
                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (User $record): bool => $record->approval_status === 'pending')
                    ->form([
                        Forms\Components\Textarea::make('approval_notes')
                            ->label('Rejection Reason')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (User $record, array $data) {
                        $record->update([
                            'admin_approved' => false,
                            'approval_status' => 'rejected',
                            'is_active' => false,
                            'approval_notes' => $data['approval_notes'],
                            'approved_by' => auth()->id(),
                        ]);

                        // Send rejection notification
                        $record->notify(new UserApprovalNotification('rejected', $data['approval_notes']));

                        Notification::make()
                            ->title('User rejected')
                            ->success()
                            ->send();
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->isAdmin();
    }

    public static function canView(Model $record): bool
    {
        return auth()->user()->isAdmin() || auth()->user()->id === $record->id;
    }

    public static function canCreate(): bool
    {
        return auth()->user()->isAdmin();
    }

    public static function canEdit(Model $record): bool
    {
        return auth()->user()->isAdmin() || auth()->user()->id === $record->id;
    }

    public static function canDelete(Model $record): bool
    {
        return auth()->user()->isAdmin() && auth()->user()->id !== $record->id;
    }
}
