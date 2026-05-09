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
    /**
     * Build the main dashboard payload from one filtered analytics window.
     *
     * The controller stays thin and this service owns the KPI calculations,
     * chart series, device split, and acquisition summary used by Overview.
     */
    public function overview(array $filters = []): array
    {
        // Resolve the website first so every query reads from the same scope
        $website = $this->website($filters);
        [$from, $to] = $this->window($filters, $this->timezone($filters, $website));
        $websiteId = $website?->id ?? '00000000-0000-0000-0000-000000000000';
        $timezone = $this->timezone($filters, $website);

        // Clone shared builders before counting so each KPI can add its own aggregate
        $pageviews = $this->pageviewsQuery($from, $to, $websiteId);
        $sessions = $this->sessionsQuery($from, $to, $websiteId);
        $totalSessions = (clone $sessions)->count();

        // Bounce rate is session-based, so pageviews are counted per session first
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
            'traffic' => $this->trafficSeries($from, $to, $websiteId, $timezone),
            'devices' => AnalyticsEvent::query()
                ->select('device', DB::raw('COUNT(*) as value'))
                ->whereBetween('occurred_at', [$from, $to])
                ->where('website_id', $websiteId)
                ->groupBy('device')
                ->get(),
            'referrers' => $this->topReferrers($filters),
        ];
    }

    /**
     * Return the most visited paths for the selected website and date range.
     *
     * The result feeds the Pages view, where page-level activity is easier to
     * scan as a table than as another chart.
     */
    public function topPages(array $filters = []): array
    {
        $website = $this->website($filters);
        [$from, $to] = $this->window($filters, $this->timezone($filters, $website));

        return Pageview::query()
            ->select('pathname', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->whereBetween('viewed_at', [$from, $to])
            ->where('website_id', $website?->id ?? '00000000-0000-0000-0000-000000000000')
            ->groupBy('pathname')
            ->orderByDesc('views')
            ->limit(20)
            ->get()
            ->all();
    }

    /**
     * Return lightweight realtime data for the dashboard polling loop.
     *
     * The shape mirrors what a websocket payload would need: active visitor
     * count plus a short list of fresh events.
     */
    public function realtime(array $filters = []): array
    {
        // A 30-minute activity window keeps the live count stable while testing
        $since = now()->subMinutes(30);
        $website = $this->website($filters);
        $websiteId = $website?->id ?? '00000000-0000-0000-0000-000000000000';

        return [
            'activeVisitors' => VisitSession::query()
                ->where('last_seen_at', '>=', $since)
                ->where('website_id', $websiteId)
                ->distinct('visitor_id')
                ->count('visitor_id'),
            'recentEvents' => AnalyticsEvent::query()
                ->where('website_id', $websiteId)
                ->latest('occurred_at')
                ->limit(12)
                ->get(['type', 'pathname', 'referrer', 'browser', 'device', 'occurred_at']),
        ];
    }

    /**
     * Summarize acquisition sources for the overview table.
     */
    private function topReferrers(array $filters): array
    {
        $website = $this->website($filters);
        [$from, $to] = $this->window($filters, $this->timezone($filters, $website));

        return Pageview::query()
            ->selectRaw("COALESCE(NULLIF(referrer, ''), 'Direct') as source, COUNT(*) as visits")
            ->whereBetween('viewed_at', [$from, $to])
            ->where('website_id', $website?->id ?? '00000000-0000-0000-0000-000000000000')
            ->groupBy('source')
            ->orderByDesc('visits')
            ->limit(8)
            ->get()
            ->all();
    }

    /**
     * Convert a partial count into a display-ready percentage.
     */
    private function percentage(int $value, int $total): float
    {
        return $total > 0 ? round(($value / $total) * 100, 1) : 0;
    }

    /**
     * Base pageview query shared by KPI and chart calculations.
     */
    private function pageviewsQuery(Carbon $from, Carbon $to, ?string $websiteId): Builder
    {
        return Pageview::query()
            ->whereBetween('viewed_at', [$from, $to])
            ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId));
    }

    /**
     * Base session query shared by visitor, session, and bounce calculations.
     */
    private function sessionsQuery(Carbon $from, Carbon $to, ?string $websiteId): Builder
    {
        return VisitSession::query()
            ->whereBetween('started_at', [$from, $to])
            ->when($websiteId, fn (Builder $query) => $query->where('website_id', $websiteId));
    }

    /**
     * Build a complete day-by-day traffic series for Recharts.
     *
     * Missing days are returned with zero views so the line chart keeps a
     * consistent x-axis across sparse datasets.
     */
    private function trafficSeries(Carbon $from, Carbon $to, string $websiteId, string $timezone): array
    {
        // Aggregate in SQL first, then fill date gaps in PHP
        $rows = Pageview::query()
            // Group traffic by the dashboard timezone
            ->selectRaw("DATE(viewed_at AT TIME ZONE 'UTC' AT TIME ZONE ?) as date, COUNT(*) as views", [$timezone])
            ->whereBetween('viewed_at', [$from, $to])
            ->where('website_id', $websiteId)
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('views', 'date')
            ->all();

        $series = [];
        $cursor = $from->copy()->setTimezone($timezone)->startOfDay();
        $lastDay = $to->copy()->setTimezone($timezone)->startOfDay();

        // Walk the local calendar so labels line up with the selected range
        while ($cursor->lte($lastDay)) {
            $date = $cursor->toDateString();
            $series[] = [
                'date' => $date,
                'views' => (int) ($rows[$date] ?? 0),
            ];
            $cursor->addDay();
        }

        return $series;
    }

    /**
     * Resolve the tracked website from the public site id used by tracker.js.
     */
    private function website(array $filters): ?Website
    {
        $siteId = $filters['siteId'] ?? 'demo-site';

        return Website::query()
            ->where('site_id', $siteId)
            ->first();
    }

    /**
     * Choose the timezone used for dashboard grouping and date windows.
     */
    private function timezone(array $filters, ?Website $website): string
    {
        // Prefer the browser timezone when the dashboard sends a valid one
        return in_array($filters['timezone'] ?? null, timezone_identifiers_list(), true)
            ? $filters['timezone']
            : ($website?->timezone ?? config('app.timezone'));
    }

    /**
     * Translate date filter strings into database query bounds.
     *
     * Users pick dates in their local dashboard calendar, while timestamps are
     * stored in UTC for consistent querying and deployment behavior.
     */
    private function window(array $filters, ?string $timezone = null): array
    {
        $timezone ??= config('app.timezone');

        return [
            // Convert local date filters into UTC query bounds
            (isset($filters['from']) ? Carbon::parse($filters['from'], $timezone)->startOfDay() : now($timezone)->subDays(14)->startOfDay())->setTimezone('UTC'),
            (isset($filters['to']) ? Carbon::parse($filters['to'], $timezone)->endOfDay() : now($timezone)->endOfDay())->setTimezone('UTC'),
        ];
    }
}
