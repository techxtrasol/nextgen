<?php

namespace App\Filament\Resources\MemberContributionResource\Pages;

use App\Filament\Resources\MemberContributionResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewMemberContribution extends ViewRecord
{
    protected static string $resource = MemberContributionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}