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

    /**
     * Keep the stored event attached so broadcast payloads can stay small and explicit.
     */
    public function __construct(public readonly AnalyticsEvent $event)
    {
    }

    /**
     * Website-scoped channels let each dashboard subscribe to its own traffic stream.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('analytics.website.'.$this->event->website_id);
    }

    /**
     * Give the frontend a stable event name for future websocket wiring.
     */
    public function broadcastAs(): string
    {
        return 'analytics.event.received';
    }

    /**
     * Send the fields needed by realtime UI without exposing the full database row.
     */
    public function broadcastWith(): array
    {
        return [
            'type' => $this->event->type,
            'pathname' => $this->event->pathname,
            'occurredAt' => $this->event->occurred_at?->toISOString(),
        ];
    }
}
