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
- timestamp

It sends events to:

```text
POST /api/track
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

## Screenshots

Add screenshots here as the UI matures:

- Overview dashboard
- Realtime dashboard
- Top pages dashboard
- Settings and tracker installation

## Roadmap

- Connect Reverb client channels in the dashboard
- Add website management and per-site authorization
- Add custom event tracking
- Add retention and funnel views
- Add API key management
- Add test coverage for ingestion and dashboard queries
