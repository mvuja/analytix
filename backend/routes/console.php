<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('analytix:heartbeat', function (): void {
    $this->info('Analytix backend is ready.');
});
