<?php

namespace App\Jobs;

use App\Events\AnalyticsEventReceived;
use App\Services\Tracking\TrackingIngestionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class IngestAnalyticsEvent implements ShouldQueue
{
    use Queueable;

    /**
     * The job receives only primitive request data so it can move to a queue worker cleanly.
     */
    public function __construct(
        public readonly array $payload,
        public readonly ?string $ipAddress,
        public readonly ?string $userAgent,
    ) {
    }

    /**
     * Write the analytics event, then fan it out for realtime listeners.
     */
    public function handle(TrackingIngestionService $ingestion): void
    {
        $event = $ingestion->ingest($this->payload, $this->ipAddress, $this->userAgent);

        event(new AnalyticsEventReceived($event));
    }
}
