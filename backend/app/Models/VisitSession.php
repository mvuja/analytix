<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisitSession extends Model
{
    use HasUuids;

    protected $table = 'sessions';

    protected $fillable = [
        'website_id',
        'session_key',
        'visitor_id',
        'started_at',
        'last_seen_at',
        'referrer',
        'browser',
        'device',
        'country',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'last_seen_at' => 'datetime',
        ];
    }

    public function website(): BelongsTo
    {
        return $this->belongsTo(Website::class);
    }

    public function pageviews(): HasMany
    {
        return $this->hasMany(Pageview::class, 'session_id');
    }
}
