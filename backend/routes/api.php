<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\WebsiteController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Keep dashboard CORS separate from public tracking
Route::options('/track', fn () => response('', 204))
    ->middleware('public.tracking.cors');

Route::post('/track', [TrackingController::class, 'store'])
    ->middleware(['public.tracking.cors', 'throttle:120,1']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/websites', [WebsiteController::class, 'index']);
    Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
    Route::get('/dashboard/pages', [DashboardController::class, 'pages']);
    Route::get('/dashboard/realtime', [DashboardController::class, 'realtime']);
});
