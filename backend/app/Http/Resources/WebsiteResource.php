<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WebsiteResource extends JsonResource
{
    /**
     * Convert backend website fields into frontend-friendly names.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'siteId' => $this->site_id,
            'name' => $this->name,
            'domain' => $this->domain,
            'timezone' => $this->timezone,
            'pageviews' => $this->whenCounted('pageviews'),
            'sessions' => $this->whenCounted('sessions'),
        ];
    }
}
