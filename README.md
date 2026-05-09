# Analytix

Analytix is a self-hosted website analytics and KPI dashboard platform built as a production-style full-stack portfolio project. It combines a Laravel API, React dashboard, PostgreSQL storage, Dockerized local development, and an embeddable tracking script.

The product direction is intentionally lightweight: a focused mix of Plausible Analytics, Umami, and PostHog foundations without adding unnecessary platform complexity too early.

## Architecture

```text
Website
  ↓
tracker.js
  ↓
Laravel API
  ↓
PostgreSQL
  ↓
React Dashboard
```

## Stack

Backend:

- Laravel 12
- Laravel Sanctum
- PostgreSQL
- Queue-ready event ingestion
- Reverb-ready broadcast event architecture
- REST API

Frontend:

- React
- Vite
- TypeScript
- React Router
- Zustand
- TanStack Query
- Axios
- Tailwind CSS
- Recharts

DevOps:

- Docker
- Docker Compose

## Monorepo Layout

```text
analytix/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Local Development

Start the full stack:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

Seeded demo login:

```text
Email: demo@analytix.dev
Password: password
```

The backend container runs:

```bash
composer install
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

The frontend container runs:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Tracker Usage

Add this snippet to any website you want to track:

```html
<script
  defer
  src="http://localhost:8000/tracker.js"
  data-site-id="my-website"
></script>
```

`data-site-id` is the public site key used to keep analytics separated per website. Use `demo-site` only for the seeded demo data; use a different value for a real website.

The tracker automatically captures:

- pageviews
- SPA navigation changes
- pathname
- referrer
- screen size
- browser
- device category
- visitor timezone
- timestamp

It sends events to:

```text
POST /api/track
```

## CORS and Tracking Safety

Analytix uses two different CORS postures because the dashboard API and the tracking API have different jobs.

Dashboard and auth routes are restricted to the configured frontend origin:

```text
FRONTEND_URL=http://localhost:5174
SANCTUM_STATEFUL_DOMAINS=localhost:5174,127.0.0.1:5174
```

That keeps authenticated endpoints such as `/api/dashboard/overview`, `/api/websites`, and `/api/auth/me` tied to the React dashboard.

Tracking is intentionally more open. The `/api/track` endpoint is designed to receive events from websites where the script is embedded, including local dev sites like `http://localhost:3000` and public sites such as `https://example.com`.

For local development, this is allowed out of the box:

```text
TRACKING_ALLOWED_ORIGINS=*
```

This only applies to `POST /api/track` and its preflight request. It does not open the authenticated dashboard API.

The tracking endpoint is safe to expose in the same way most analytics ingestion endpoints are public-facing:

- it does not require or send dashboard credentials
- it accepts a narrow, validated payload
- it is rate limited with `throttle:120,1`
- it stores analytics events, not private user account data
- malformed requests are rejected before ingestion

For a stricter production deployment, replace `*` with a comma-separated allowlist:

```text
TRACKING_ALLOWED_ORIGINS=https://myshop.com,https://www.myshop.com
```

## API Endpoints

Public:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/track`

Authenticated:

- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/websites`
- `GET /api/dashboard/overview`
- `GET /api/dashboard/pages`
- `GET /api/dashboard/realtime`

## Backend Notes

The ingestion path is intentionally queue-ready:

1. `POST /api/track` validates the event payload.
2. `IngestAnalyticsEvent` is dispatched.
3. `TrackingIngestionService` resolves the website, session, event, and pageview records.
4. `AnalyticsEventReceived` is ready to broadcast events for future Reverb-powered realtime UI.

Core analytics tables:

- `websites`
- `sessions`
- `analytics_events`
- `pageviews`

Local development uses the `sync` queue driver so tracking data appears immediately. Switch `QUEUE_CONNECTION=database` and run `php artisan queue:work` when you want a separate worker process. Laravel session storage is configured as cookie-based for local development so the analytics `sessions` table remains clean and domain-specific.

## Frontend Notes

The dashboard app is organized around reusable product surfaces:

- `components/`
- `layouts/`
- `pages/`
- `hooks/`
- `services/`
- `stores/`
- `lib/`
- `types/`

State responsibilities:

- `authStore`: current user, login/register/logout, auth bootstrap
- `uiStore`: dark mode and responsive sidebar state
- `filterStore`: analytics date range filters

Data fetching is centralized through:

- `src/lib/api.ts`
- `src/lib/queryClient.ts`
- `src/services/*`
- `src/hooks/useDashboardQueries.ts`
