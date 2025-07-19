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
                Tables\Columns\BadgeColumn::make('role')
                    ->colors([
                        'primary' => 'member',
                        'success' => 'admin',
                        'warning' => 'treasurer',
                    ]),
                Tables\Columns\TextColumn::make('total_contributions')
                    ->label('Contributions')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\TextColumn::make('available_loan_limit')
                    ->label('Loan Limit')
                    ->money('KSH')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('joined_at')
                    ->label('Joined')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        'member' => 'Member',
                        'admin' => 'Admin',
                        'treasurer' => 'Treasurer',
                    ]),
                Tables\Filters\Filter::make('is_active')
                    ->query(fn (Builder $query): Builder => $query->where('is_active', true))
                    ->label('Active Members'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
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
        return auth()->user()->isAdmin() || auth()->id() === $record->id;
    }

    public static function canCreate(): bool
    {
        return auth()->user()->isAdmin();
    }

    public static function canEdit(Model $record): bool
    {
        return auth()->user()->isAdmin() || auth()->id() === $record->id;
    }

    public static function canDelete(Model $record): bool
    {
        return auth()->user()->isAdmin() && auth()->id() !== $record->id;
    }
}
