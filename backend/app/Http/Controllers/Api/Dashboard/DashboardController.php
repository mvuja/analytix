<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Resources\OverviewResource;
use App\Services\Analytics\DashboardAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    /**
     * Dashboard endpoints share one analytics service so calculations stay consistent.
     */
    public function __construct(private readonly DashboardAnalyticsService $analytics)
    {
    }

    /**
     * Return the KPI cards and overview chart data.
     */
    public function overview(Request $request): OverviewResource
    {
        return OverviewResource::make($this->analytics->overview($request->query()));
    }

    /**
     * Return page-level analytics for the Pages table.
     */
    public function pages(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->analytics->topPages($request->query()),
        ]);
    }

    /**
     * Return polling-friendly data for the Realtime screen.
     */
    public function realtime(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->analytics->realtime($request->query()),
        ]);
    }
}
