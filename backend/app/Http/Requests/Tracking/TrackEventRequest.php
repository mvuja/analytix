<?php

namespace App\Http\Requests\Tracking;

use Illuminate\Foundation\Http\FormRequest;

class TrackEventRequest extends FormRequest
{
    /**
     * Validate the public tracker payload before it reaches ingestion.
     */
    public function rules(): array
    {
        return [
            'siteId' => ['required', 'string', 'max:120'],
            'type' => ['required', 'string', 'in:pageview,event'],
            'sessionId' => ['required', 'string', 'max:120'],
            'visitorId' => ['required', 'string', 'max:120'],
            'pathname' => ['required', 'string', 'max:2048'],
            'title' => ['nullable', 'string', 'max:255'],
            'referrer' => ['nullable', 'string', 'max:2048'],
            'screen' => ['nullable', 'string', 'max:60'],
            'browser' => ['nullable', 'string', 'max:120'],
            'device' => ['nullable', 'string', 'max:120'],
            'timezone' => ['nullable', 'timezone'],
            'timestamp' => ['nullable', 'date'],
            'metadata' => ['nullable', 'array'],
        ];
    }

    /**
     * Return a named payload method so controllers avoid reaching into request internals.
     */
    public function toPayload(): array
    {
        return $this->validated();
    }
}
