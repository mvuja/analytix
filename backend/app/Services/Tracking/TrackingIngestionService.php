<?php

namespace App\Services\Tracking;

use App\Models\AnalyticsEvent;
use App\Models\Pageview;
use App\Models\VisitSession;
use App\Models\Website;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class TrackingIngestionService
{
    public function ingest(array $payload, ?string $ipAddress, ?string $userAgent): AnalyticsEvent
    {
        $website = Website::query()->firstOrCreate(
            ['site_id' => $payload['siteId']],
            [
                'name' => Str::headline($payload['siteId']),
                'domain' => parse_url($payload['referrer'] ?? '', PHP_URL_HOST) ?: 'unknown.local',
                'timezone' => 'UTC',
            ],
        );

        $occurredAt = Carbon::parse($payload['timestamp'] ?? now());
        $session = VisitSession::query()->updateOrCreate(
            [
                'website_id' => $website->id,
                'session_key' => $payload['sessionId'],
            ],
            [
                'visitor_id' => $payload['visitorId'],
                'started_at' => $occurredAt,
                'last_seen_at' => $occurredAt,
                'referrer' => $payload['referrer'] ?? null,
                'browser' => $payload['browser'] ?? $this->guessBrowser($userAgent),
                'device' => $payload['device'] ?? 'desktop',
            ],
        );

        $event = AnalyticsEvent::query()->create([
            'website_id' => $website->id,
            'session_id' => $session->id,
            'type' => $payload['type'],
            'pathname' => $payload['pathname'],
            'referrer' => $payload['referrer'] ?? null,
            'browser' => $payload['browser'] ?? $this->guessBrowser($userAgent),
            'device' => $payload['device'] ?? 'desktop',
            'screen' => $payload['screen'] ?? null,
            'occurred_at' => $occurredAt,
            'metadata' => [
                ...($payload['metadata'] ?? []),
                // Store a salted hash instead of the raw IP address
                'ip_hash' => $ipAddress ? hash('sha256', $ipAddress.config('app.key')) : null,
            ],
        ]);

        if ($payload['type'] === 'pageview') {
            Pageview::query()->create([
                'website_id' => $website->id,
                'session_id' => $session->id,
                'pathname' => $payload['pathname'],
                'title' => $payload['title'] ?? null,
                'referrer' => $payload['referrer'] ?? null,
                'viewed_at' => $occurredAt,
            ]);
        }

        return $event;
    }

    private function guessBrowser(?string $userAgent): string
    {
        return match (true) {
            str_contains((string) $userAgent, 'Firefox') => 'Firefox',
            str_contains((string) $userAgent, 'Edg') => 'Edge',
            str_contains((string) $userAgent, 'Chrome') => 'Chrome',
            str_contains((string) $userAgent, 'Safari') => 'Safari',
            default => 'Unknown',
        };
    }
}
