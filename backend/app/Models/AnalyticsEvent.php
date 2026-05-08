<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    use HasUuids;

    protected $fillable = [
        'website_id',
        'session_id',
        'type',
        'pathname',
        'referrer',
        'browser',
        'device',
        'screen',
        'occurred_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    public function website(): BelongsTo
    {
        return $this->belongsTo(Website::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(VisitSession::class, 'session_id');
    }
}
