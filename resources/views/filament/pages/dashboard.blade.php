<x-filament-panels::page>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="space-y-4">
            @foreach ($this->getHeaderWidgets() as $widget)
                @livewire($widget)
            @endforeach
        </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        @foreach ($this->getFooterWidgets() as $widget)
            @livewire($widget)
        @endforeach
    </div>
</x-filament-panels::page>
