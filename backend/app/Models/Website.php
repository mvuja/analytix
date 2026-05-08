<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Website extends Model
{
    use HasUuids;

    protected $fillable = [
        'site_id',
        'name',
        'domain',
        'timezone',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(VisitSession::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(AnalyticsEvent::class);
    }

    public function pageviews(): HasMany
    {
        return $this->hasMany(Pageview::class);
    }
}
