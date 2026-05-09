<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicTrackingCors
{
    /**
     * Apply permissive CORS only to the public tracking endpoint.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Answer tracking preflights before the request reaches ingestion
        $response = $request->isMethod('OPTIONS')
            ? response('', 204)
            : $next($request);

        $origin = $request->headers->get('Origin');
        $allowedOrigin = $this->allowedOrigin($origin);

        if ($allowedOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $response->headers->set('Vary', 'Origin');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Accept');
        $response->headers->set('Access-Control-Max-Age', '3600');

        return $response;
    }

    /**
     * Resolve the allowed origin from a comma-separated env allowlist.
     */
    private function allowedOrigin(?string $origin): ?string
    {
        $allowed = array_filter(array_map('trim', explode(',', env('TRACKING_ALLOWED_ORIGINS', '*'))));

        // Allow embedded trackers without opening dashboard APIs
        if (in_array('*', $allowed, true)) {
            return '*';
        }

        return $origin && in_array($origin, $allowed, true) ? $origin : null;
    }
}
