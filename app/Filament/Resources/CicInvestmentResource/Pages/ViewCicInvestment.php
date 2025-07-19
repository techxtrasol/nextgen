<?php

namespace App\Filament\Resources\CicInvestmentResource\Pages;

use App\Filament\Resources\CicInvestmentResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCicInvestment extends ViewRecord
{
    protected static string $resource = CicInvestmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}