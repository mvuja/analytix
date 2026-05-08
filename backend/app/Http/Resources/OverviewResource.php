<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OverviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'kpis' => $this->resource['kpis'],
            'traffic' => $this->resource['traffic'],
            'devices' => $this->resource['devices'],
            'referrers' => $this->resource['referrers'],
        ];
    }
}
