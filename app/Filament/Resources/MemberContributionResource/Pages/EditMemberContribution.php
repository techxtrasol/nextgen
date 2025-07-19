<?php

namespace App\Filament\Resources\MemberContributionResource\Pages;

use App\Filament\Resources\MemberContributionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMemberContribution extends EditRecord
{
    protected static string $resource = MemberContributionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}