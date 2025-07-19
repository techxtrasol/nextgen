<?php

namespace App\Filament\Resources\MemberContributionResource\Pages;

use App\Filament\Resources\MemberContributionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMemberContributions extends ListRecords
{
    protected static string $resource = MemberContributionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}