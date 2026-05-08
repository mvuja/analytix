<?php

namespace App\Events;

use App\Models\AnalyticsEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AnalyticsEventReceived implements ShouldBroadcast
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public readonly AnalyticsEvent $event)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('analytics.website.'.$this->event->website_id);
    }

    public function broadcastAs(): string
    {
        return 'analytics.event.received';
    }

    public function broadcastWith(): array
    {
        return [
            'type' => $this->event->type,
            'pathname' => $this->event->pathname,
            'occurredAt' => $this->event->occurred_at?->toISOString(),
        ];
    }
}
