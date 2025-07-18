<?php

namespace App\Filament\Resources\CicInvestmentResource\Pages;

use App\Filament\Resources\CicInvestmentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCicInvestment extends EditRecord
{
    protected static string $resource = CicInvestmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}