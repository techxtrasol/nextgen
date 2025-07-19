<?php

namespace App\Filament\Resources\MilestoneResource\Pages;

use App\Filament\Resources\MilestoneResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewMilestone extends ViewRecord
{
    protected static string $resource = MilestoneResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}