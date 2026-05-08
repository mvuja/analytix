<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Resources\OverviewResource;
use App\Services\Analytics\DashboardAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardAnalyticsService $analytics)
    {
    }

    public function overview(Request $request): OverviewResource
    {
        return OverviewResource::make($this->analytics->overview($request->query()));
    }

    public function pages(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->analytics->topPages($request->query()),
        ]);
    }

    public function realtime(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->analytics->realtime($request->query()),
        ]);
    }
}
