<?php

namespace Database\Seeders;

use App\Models\AnalyticsEvent;
use App\Models\Pageview;
use App\Models\User;
use App\Models\VisitSession;
use App\Models\Website;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'demo@analytix.dev'],
            [
                'name' => 'Demo Founder',
                'password' => Hash::make('password'),
            ],
        );

        $website = Website::query()->updateOrCreate(
            ['site_id' => 'demo-site'],
            [
                'name' => 'Analytix Demo',
                'domain' => 'demo.analytix.local',
                'timezone' => 'UTC',
            ],
        );

        $paths = ['/', '/pricing', '/docs', '/blog/launch', '/dashboard', '/contact'];
        $referrers = ['', 'https://google.com', 'https://github.com', 'https://news.ycombinator.com', 'https://x.com'];
        $browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
        $devices = ['desktop', 'mobile', 'tablet'];

        foreach (range(1, 80) as $index) {
            $startedAt = Carbon::now()->subDays(random_int(0, 14))->subMinutes(random_int(0, 1200));
            $session = VisitSession::query()->create([
                'website_id' => $website->id,
                'session_key' => 'session_'.Str::lower(Str::random(12)),
                'visitor_id' => 'visitor_'.Str::lower(Str::random(12)),
                'started_at' => $startedAt,
                'last_seen_at' => (clone $startedAt)->addMinutes(random_int(1, 45)),
                'referrer' => $referrers[array_rand($referrers)],
                'browser' => $browsers[array_rand($browsers)],
                'device' => $devices[array_rand($devices)],
                'country' => ['US', 'DE', 'BA', 'GB', 'CA'][array_rand(['US', 'DE', 'BA', 'GB', 'CA'])],
            ]);

            foreach (range(1, random_int(1, 4)) as $view) {
                $path = $paths[array_rand($paths)];
                $viewedAt = (clone $startedAt)->addMinutes($view * random_int(1, 8));

                AnalyticsEvent::query()->create([
                    'website_id' => $website->id,
                    'session_id' => $session->id,
                    'type' => 'pageview',
                    'pathname' => $path,
                    'referrer' => $session->referrer,
                    'browser' => $session->browser,
                    'device' => $session->device,
                    'screen' => random_int(0, 1) ? '1440x900' : '390x844',
                    'occurred_at' => $viewedAt,
                    'metadata' => ['seeded' => true],
                ]);

                Pageview::query()->create([
                    'website_id' => $website->id,
                    'session_id' => $session->id,
                    'pathname' => $path,
                    'title' => Str::headline(trim($path, '/') ?: 'home'),
                    'referrer' => $session->referrer,
                    'viewed_at' => $viewedAt,
                ]);
            }
        }
    }
}
