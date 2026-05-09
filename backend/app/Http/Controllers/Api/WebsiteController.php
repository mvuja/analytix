<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\WebsiteResource;
use App\Models\Website;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;

class WebsiteController extends Controller
{
    /**
     * List tracked websites with lightweight counts for the dashboard selector.
     */
    public function index(): AnonymousResourceCollection
    {
        return WebsiteResource::collection(
            Website::query()
                ->withCount(['pageviews', 'sessions'])
                ->orderBy('name')
                ->get(),
        );
    }
}
