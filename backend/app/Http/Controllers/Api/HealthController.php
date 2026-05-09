<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class HealthController extends Controller
{
    /**
     * Provide a simple API heartbeat for Docker and manual checks.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'analytix-api',
            'timestamp' => now()->toISOString(),
        ]);
    }
}
