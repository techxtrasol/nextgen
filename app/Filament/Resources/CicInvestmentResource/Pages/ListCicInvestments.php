<?php

namespace App\Filament\Resources\CicInvestmentResource\Pages;

use App\Filament\Resources\CicInvestmentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCicInvestments extends ListRecords
{
    protected static string $resource = CicInvestmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}