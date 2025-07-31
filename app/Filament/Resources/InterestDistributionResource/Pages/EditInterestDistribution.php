<?php

namespace App\Filament\Resources\InterestDistributionResource\Pages;

use App\Filament\Resources\InterestDistributionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInterestDistribution extends EditRecord
{
    protected static string $resource = InterestDistributionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
