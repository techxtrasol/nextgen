<?php

namespace App\Filament\Resources\MemberContributionResource\Pages;

use App\Filament\Resources\MemberContributionResource;
use App\Models\MemberContribution;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMemberContribution extends EditRecord
{
    protected static string $resource = MemberContributionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\Action::make('approve')
                ->label('Approve')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->action(function () {
                    $record = $this->getRecord();
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

                    $this->getRecord()->save();
                    $this->redirect($this->getResource()::getUrl('index'));
                })
                ->visible(fn () => $this->getRecord()->status === 'pending')
                ->requiresConfirmation()
                ->modalHeading('Approve Contribution')
                ->modalDescription('Are you sure you want to approve this contribution? This will update the member\'s total contributions and loan limit.')
                ->modalSubmitActionLabel('Yes, approve'),
            Actions\Action::make('reject')
                ->label('Reject')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->action(function () {
                    $record = $this->getRecord();
                    $record->update([
                        'status' => 'rejected',
                        'approved_by' => auth()->id(),
                        'approved_at' => now(),
                    ]);

                    $this->getRecord()->save();
                    $this->redirect($this->getResource()::getUrl('index'));
                })
                ->visible(fn () => $this->getRecord()->status === 'pending')
                ->requiresConfirmation()
                ->modalHeading('Reject Contribution')
                ->modalDescription('Are you sure you want to reject this contribution?')
                ->modalSubmitActionLabel('Yes, reject'),
            Actions\DeleteAction::make(),
        ];
    }
}
