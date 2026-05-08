# Analytix Architecture

Analytix is split into two separate apps inside one monorepo:

- `backend`: Laravel API, persistence, ingestion, auth, and realtime event preparation.
- `frontend`: React dashboard consuming the API through Axios and TanStack Query.

## Request Flow

```text
External website
  -> backend/public/tracker.js
  -> POST /api/track
  -> TrackEventRequest
  -> IngestAnalyticsEvent job
  -> TrackingIngestionService
  -> PostgreSQL
  -> AnalyticsEventReceived broadcast
```

The tracker endpoint returns quickly with `202 Accepted`. The job can run synchronously in local development or on a real queue worker later.

The tracker sends a `siteId` with every event. Dashboard queries use that same site id to keep demo traffic, portfolio traffic, and future customer traffic separated.

## Dashboard Flow

```text
React route
  -> dashboard query hook
  -> dashboard service
  -> Axios API client
  -> Laravel controller
  -> DashboardAnalyticsService
  -> PostgreSQL aggregates
```

The dashboard reads aggregate endpoints rather than database-shaped payloads. This keeps the frontend loosely coupled to the backend schema while remaining simple.

## Realtime Readiness

`AnalyticsEventReceived` implements `ShouldBroadcast`, so the backend already has the domain event needed for Reverb channels. The current frontend uses polling for `GET /api/dashboard/realtime`; that can be replaced or supplemented with WebSocket subscriptions without changing the ingestion contract.
