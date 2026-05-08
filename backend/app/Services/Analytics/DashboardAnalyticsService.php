<?php

namespace App\Services\Analytics;

use App\Models\AnalyticsEvent;
use App\Models\Pageview;
use App\Models\VisitSession;
use App\Models\Website;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardAnalyticsService
{
    public function overview(array $filters = []): array
    {
        [$from, $to] = $this->window($filters);
        $websiteId = $this->websiteId($filters);

        $pageviews = $this->pageviewsQuery($from, $to, $websiteId);
        $sessions = $this->sessionsQuery($from, $to, $websiteId);
        $totalSessions = (clone $sessions)->count();

        $bouncedSessions = $this->sessionsQuery($from, $to, $websiteId)
            ->withCount('pageviews')
            ->get()
            ->filter(fn (VisitSession $session): bool => $session->pageviews_count <= 1)
            ->count();

        return [
            'kpis' => [
                'pageviews' => (clone $pageviews)->count(),
                'visitors' => (clone $sessions)->distinct('visitor_id')->count('visitor_id'),
                'sessions' => $totalSessions,
                'bounceRate' => $this->percentage($bouncedSessions, $totalSessions),
            ],
            'traffic' => Pageview::query()
                ->selectRaw("DATE(viewed_at) as date, COUNT(*) as views")
                ->whereBetween('viewed_at', [$from, $to])
                ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'devices' => AnalyticsEvent::query()
                ->select('device', DB::raw('COUNT(*) as value'))
                ->whereBetween('occurred_at', [$from, $to])
                ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId))
                ->groupBy('device')
                ->get(),
            'referrers' => $this->topReferrers($filters),
        ];
    }

    public function topPages(array $filters = []): array
    {
        [$from, $to] = $this->window($filters);

        return Pageview::query()
            ->select('pathname', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->whereBetween('viewed_at', [$from, $to])
            ->when($this->websiteId($filters), fn (Builder $query, string $websiteId) => $query->where('website_id', $websiteId))
            ->groupBy('pathname')
            ->orderByDesc('views')
            ->limit(20)
            ->get()
            ->all();
    }

    public function realtime(array $filters = []): array
    {
        $since = now()->subMinutes(30);
        $websiteId = $this->websiteId($filters);

        return [
            'activeVisitors' => VisitSession::query()
                ->where('last_seen_at', '>=', $since)
                ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId))
                ->distinct('visitor_id')
                ->count('visitor_id'),
            'recentEvents' => AnalyticsEvent::query()
                ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId))
                ->latest('occurred_at')
                ->limit(12)
                ->get(['type', 'pathname', 'referrer', 'browser', 'device', 'occurred_at']),
        ];
    }

    private function topReferrers(array $filters): array
    {
        [$from, $to] = $this->window($filters);

        return Pageview::query()
            ->selectRaw("COALESCE(NULLIF(referrer, ''), 'Direct') as source, COUNT(*) as visits")
            ->whereBetween('viewed_at', [$from, $to])
            ->when($this->websiteId($filters), fn (Builder $query, string $websiteId) => $query->where('website_id', $websiteId))
            ->groupBy('source')
            ->orderByDesc('visits')
            ->limit(8)
            ->get()
            ->all();
    }

    private function percentage(int $value, int $total): float
    {
        return $total > 0 ? round(($value / $total) * 100, 1) : 0;
    }

    private function pageviewsQuery(Carbon $from, Carbon $to, ?string $websiteId): Builder
    {
        return Pageview::query()
            ->whereBetween('viewed_at', [$from, $to])
            ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId));
    }

    private function sessionsQuery(Carbon $from, Carbon $to, ?string $websiteId): Builder
    {
        return VisitSession::query()
            ->whereBetween('started_at', [$from, $to])
            ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId));
    }

    private function websiteId(array $filters): string
    {
        $siteId = $filters['siteId'] ?? 'demo-site';

        return Website::query()
            ->where('site_id', $siteId)
            ->value('id') ?? '00000000-0000-0000-0000-000000000000';
    }

    private function window(array $filters): array
    {
        return [
            isset($filters['from']) ? Carbon::parse($filters['from'])->startOfDay() : now()->subDays(14)->startOfDay(),
            isset($filters['to']) ? Carbon::parse($filters['to'])->endOfDay() : now()->endOfDay(),
        ];
    }
}
