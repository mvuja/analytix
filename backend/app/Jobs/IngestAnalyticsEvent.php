<?php

namespace App\Jobs;

use App\Events\AnalyticsEventReceived;
use App\Services\Tracking\TrackingIngestionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class IngestAnalyticsEvent implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly array $payload,
        public readonly ?string $ipAddress,
        public readonly ?string $userAgent,
    ) {
    }

    public function handle(TrackingIngestionService $ingestion): void
    {
        $event = $ingestion->ingest($this->payload, $this->ipAddress, $this->userAgent);

        event(new AnalyticsEventReceived($event));
    }
}
