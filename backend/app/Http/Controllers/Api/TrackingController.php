<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Tracking\TrackEventRequest;
use App\Jobs\IngestAnalyticsEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class TrackingController extends Controller
{
    public function store(TrackEventRequest $request): JsonResponse
    {
        IngestAnalyticsEvent::dispatch($request->toPayload(), $request->ip(), $request->userAgent());

        return response()->json(['accepted' => true], 202);
    }
}
