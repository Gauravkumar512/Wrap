# Wrap - URL Shortener with Click Analytics

A full-stack URL shortener with a React frontend and a production-grade Express backend. Built to learn core backend engineering concepts - PostgreSQL, Redis, BullMQ, Clerk auth, Docker, and TypeScript.

**Stack:** Node.js · Express · TypeScript · Prisma · PostgreSQL · Redis · BullMQ · Clerk · React · Vite · Tailwind CSS · Recharts

---

## What This Project Does

- Shorten any long URL into a 6-character slug
- Redirect users instantly via a Redis cache-aside pattern (~7ms)
- Check expiry on every redirect - returns 410 Gone for expired links
- Track click analytics asynchronously without blocking the redirect
- Serve aggregated analytics (total clicks, by country, by device) with Redis caching (~5ms)
- Clerk-based authentication - protected routes return 401 without a valid session token
- Ownership checks on analytics - only the user who created a link can view its analytics
- Rate limiting - 10 creates/min and 60 redirects/min per IP via express-rate-limit
- Security headers on every response via Helmet

---

## Architecture

```
POST /shorten          → requireAuth → scheme + SSRF check → Zod validation → nanoid slug → PostgreSQL → Redis warm → 201
GET  /:slug            → rate limit (60/min) → slug validation → Redis HIT (~7ms) or MISS → PostgreSQL → expiry check → Redis heal → 302
                         → async: BullMQ job pushed after redirect
                              ↓
                         Worker picks up job → INSERT into clicks table → bust analytics cache
GET  /analytics/:slug  → requireAuth → slug validation → ownership check → Redis HIT (5ms) or MISS
                         → 4 parallel PG queries → Redis cache → 200
GET  /links            → requireAuth → PostgreSQL findMany (by clerkUserId) → 200
DELETE /urls/:slug     → requireAuth → ownership check → Redis del (url + analytics) → PostgreSQL delete → 200
GET  /health           → prisma.$queryRaw SELECT 1 + redis.ping() → 200 or 503
```

### Why Each Tool Was Chosen

| Tool               | Job                               | Why not something else                                                                                  |
| ------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| PostgreSQL         | Source of truth - urls, clicks    | Relational integrity. Foreign keys, cascade deletes. SQL aggregations for analytics.                    |
| Prisma             | Type-safe DB queries + migrations | Auto-generates TypeScript types from schema. Migration files track schema changes.                      |
| Redis              | Cache + BullMQ backend            | RAM-based (~0.1ms reads). Shared across all Node.js instances - unlike in-process memory.               |
| BullMQ             | Async job queue for analytics     | Decouples analytics write latency from redirect response. Worker failure never affects redirects.       |
| Clerk              | Authentication                    | Managed auth - no password storage, no JWT signing, no session management to build.                     |
| Helmet             | Security headers                  | Sets X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy in one call.                        |
| express-rate-limit | Rate limiting                     | Prevents redirect enumeration and shorten abuse. In-memory store, Redis store ready for multi-instance. |
| Zod                | Input validation                  | Runtime validation + TypeScript type inference from one schema definition.                              |
| nanoid             | Slug generation                   | Random 6-char slug. No DB round-trip to generate. Collision handled via retry + P2002.                  |
| Docker Compose     | Local dev environment             | PostgreSQL and Redis run as containers. No local installs needed.                                       |

---

## Monorepo Structure

```
Wrap/
  backend/             ← Express API + BullMQ worker
  frontend/            ← React + Vite app
  README.md
```

### Backend

```
backend/
  src/
    config/
      db.ts            ← Prisma client singleton
      redis.ts         ← ioredis client + event listeners
      queue.ts         ← BullMQ queue instance with retry config (3 attempts, exponential backoff)
    controllers/
      shorten.controller.ts    ← scheme blocklist + SSRF guard + slug creation
      redirect.controller.ts   ← slug validation + cache-aside redirect
      analytics.controller.ts  ← slug validation + per-link analytics
      links.controller.ts      ← GET /links, DELETE /urls/:slug
    services/
      url.service.ts           ← createShortUrl, getUrlBySlug, getUserLinks, deleteLink
      cache.service.ts         ← getCachedUrl, setCachedUrl, deleteCachedUrl, deleteAnalyticsCache (all Redis-safe with fallback)
      analytics.service.ts     ← getAnalytic with Redis caching + ownership check
    workers/
      click.worker.ts          ← BullMQ worker, UA parsing, prisma.click.create, analytics cache bust
    routes/
      index.ts                 ← all routes with requireAuth() guards and rate limiters
    middleware/
      error.middleware.ts      ← global error handler (hides stack in production)
    schemas/
      shorten.schema.ts        ← Zod schema for POST /shorten
    types/
      index.ts                 ← ShortenRequest, ClickEvent interfaces
    app.ts                     ← Express setup, Helmet, clerkMiddleware, CORS, routes, deep /health
    server.ts                  ← env var validation at boot, app.listen
  prisma/
    schema.prisma              ← single source of truth for DB structure
    migrations/                ← auto-generated SQL migration files
  docker-compose.yml           ← postgres + redis containers with healthchecks
```

### Frontend

```
frontend/
  src/
    pages/
      Landing.tsx              ← hero, features - shows "Go to Dashboard" when signed in
      Dashboard.tsx            ← stats cards + links table + create modal
      Analytics.tsx            ← per-slug analytics with charts and recent clicks
      AnalyticsOverview.tsx    ← /analytics overview: total clicks, links ranked by clicks
    components/
      layout/
        Sidebar.tsx            ← fixed sidebar with Dashboard + Analytics nav, Clerk UserButton
        Navbar.tsx             ← landing navbar with SignInButton
      links/
        LinksTable.tsx         ← table with copy, open, analytics, delete actions
        CreateLinkModal.tsx    ← modal with success state showing the short URL
        DeleteConfirmDialog.tsx
      analytics/
        StatsCard.tsx          ← reusable metric card
        DeviceChart.tsx        ← donut chart (Recharts)
        CountryChart.tsx       ← horizontal bar chart (Recharts)
        RecentClicksTable.tsx  ← recent clicks (time, country, device, referrer)
    hooks/
      useLinks.ts              ← fetch, create, delete links with refetch
      useAnalytics.ts          ← fetch analytics for a slug
    lib/
      api.ts                   ← all API calls with fresh Clerk Bearer token per request
      utils.ts                 ← cn, truncateUrl, formatRelativeTime, copyToClipboard (with execCommand fallback), buildShortUrl
  public/
    favicon.svg                ← branded favicon
  index.html                   ← CSP meta tag, favicon link
  main.tsx                     ← StrictMode + React Error Boundary
```

---

## Database Schema

### urls

| Column      | Type        | Constraint      | Note                              |
| ----------- | ----------- | --------------- | --------------------------------- |
| id          | SERIAL      | PRIMARY KEY     | Auto-increment                    |
| slug        | VARCHAR     | UNIQUE NOT NULL | Indexed - fast lookup on redirect |
| longUrl     | TEXT        | NOT NULL        | Original URL                      |
| clerkUserId | TEXT        | NULLABLE        | Clerk user ID string (not a FK)   |
| expiresAT   | TIMESTAMPTZ | NOT NULL        | 30-day expiry set on creation     |
| createdAt   | TIMESTAMPTZ | DEFAULT NOW()   |                                   |

### clicks (analytics)

| Column    | Type        | Constraint                      | Note                                           |
| --------- | ----------- | ------------------------------- | ---------------------------------------------- |
| id        | BIGINT      | PRIMARY KEY                     | BIGSERIAL - this table grows large             |
| urlId     | INTEGER     | FK → urls(id) ON DELETE CASCADE | Cascade: delete URL → all clicks deleted       |
| clickedAt | TIMESTAMPTZ | DEFAULT NOW()                   | Indexed (composite)                            |
| ipAddress | TEXT        | NULLABLE                        | Stored in DB only - not returned to clients    |
| userAgent | TEXT        | NULLABLE                        | Parsed device type (mobile / tablet / desktop) |
| country   | TEXT        | NULLABLE                        | From cf-ipcountry header in production         |
| referrer  | TEXT        | NULLABLE                        |                                                |

### Indexes

```sql
CREATE UNIQUE INDEX ON "Url"("slug");
CREATE INDEX "Click_urlId_clickedAt_idx" ON "Click"("urlId", "clickedAt" DESC);
```

**Why the composite index?** Every analytics query filters by `urlId` and sorts by `clickedAt DESC`. Without it, PostgreSQL scans the entire clicks table and sorts in memory. With it, rows are pre-grouped and pre-sorted - no scan, no sort.

---

## Key Concepts

### 1. Cache-Aside Pattern (Redis)

Check cache first. On HIT → serve from Redis. On MISS → query PostgreSQL, write result back to Redis, serve. Redis failures fall through to PostgreSQL gracefully - no 500s on Redis downtime.

```
Redis GET url:slug
  ├── HIT  → expiry check → redirect (~7ms)
  └── MISS → PostgreSQL → Redis SET url:slug (re-warm) → expiry check → redirect
```

Keys are namespaced: `url:{slug}` for redirects, `analytics:{slug}` for analytics. Prevents collisions in the flat Redis keyspace.

### 2. Async Analytics with BullMQ

After `res.redirect()` is sent the user is already gone. The API then pushes a job to BullMQ. A separate worker process picks it up, writes to the clicks table, then busts the analytics cache so the next view reflects the new click.

```typescript
res.redirect(302, targetUrl)                    // user is gone
clickQueue.add('click-events', {...}).catch(...)  // fires after, never awaited
// worker: INSERT click → redis.del(`analytics:${slug}`)
```

**Why separate process?** If the worker crashes, redirects keep working. Worker failures are isolated from the hot path. `npm run dev` starts both the API and worker together via `concurrently`.

### 3. Expiry Enforcement (410 Gone)

`expiresAT` is stored in PostgreSQL and cached in Redis alongside `longUrl`. Both the cache hit and the DB miss path check it:

```typescript
if (new Date(cached.expiresAt) < new Date()) {
  res.status(410).json({ error: 'Gone', message: 'This link has expired' });
  return;
}
```

Returns HTTP **410 Gone** (not 404) - signals the resource existed but is permanently gone.

### 4. Ownership Checks

Analytics are private. `getAnalytic()` compares the link's `clerkUserId` against the requesting user's Clerk ID and returns a `'forbidden'` sentinel - not a thrown error - for clean 403 handling in the controller:

```typescript
if (url.clerkUserId !== clerkUserId) return 'forbidden'
// controller:
if (analyticData === 'forbidden') { res.status(403)... }
```

`clerkUserId` is stored inside the analytics cache (for ownership checks on cache hits) but stripped from the API response. Raw IP addresses are stored in the DB but never returned to the frontend.

### 5. Promise.all for Parallel Queries

Analytics queries are independent. Run them in parallel:

```typescript
const [totalClicks, grpCountry, grpDevice, recentClicks] = await Promise.all([
  prisma.click.count({ where: { urlId: url.id } }),
  prisma.click.groupBy({ by: ['country'], ... }),
  prisma.click.groupBy({ by: ['userAgent'], ... }),
  prisma.click.findMany({ orderBy: { clickedAt: 'desc' }, take: 10, ... }),
])
```

Total time = slowest single query, not the sum.

### 6. HTTP 302 vs 301

- **301 Permanent** → browser caches redirect forever. Subsequent clicks bypass your server. Analytics break.
- **302 Temporary** → browser always checks back. Every click hits your server. Analytics work.

Always use **302** when you need to track clicks.

### 7. Error Middleware Security

Stack traces are logged server-side, never sent to clients. In production, the error response body contains only a generic message:

```typescript
res.status(500).json({
  error: 'Something went wrong',
  ...(process.env.NODE_ENV === 'development' && { message: err.message }),
});
```

---

## Running Locally

**Prerequisites:** Docker Desktop, Node.js 20+

### Backend

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Copy env and fill in your Clerk keys
cp .env.example .env

# 3. Start PostgreSQL and Redis
docker compose up -d

# 4. Run migrations
npx prisma migrate dev

# 5. Start API server + BullMQ worker together
npm run dev
```

`npm run dev` uses `concurrently` to run both the Express API (`[api]`) and the BullMQ worker (`[worker]`) in one terminal with colour-coded output. Use `npm run dev:api` or `npm run worker` to run them separately.

**`backend/.env`:**

```env
PORT=3000
DATABASE_URL="postgresql://wrap_admin:wrap_password@localhost:5432/wrap_db"
REDIS_URL="redis://localhost:63790"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy env and fill in your Clerk publishable key
cp .env.example .env

# 3. Start dev server
npm run dev
```

**`frontend/.env`:**

```env
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## API Reference

All endpoints except `GET /:slug` and `GET /health` require a valid Clerk session token:

```
Authorization: Bearer <clerk_session_token>
```

### POST /shorten

```json
Request:  { "longUrl": "https://github.com/gaurav/project" }
Response: { "message": "Short URL created successfully", "shortUrl": "http://localhost:3000/xK9mP2", "slug": "xK9mP2" }
Errors:   400 if scheme is not http/https, 400 if URL resolves to a private address, 429 if rate limit exceeded
```

### GET /:slug

```
Response: 302 redirect to longUrl
          410 Gone if the link has expired
          404 if the slug does not exist or has an invalid format
          429 if rate limit exceeded (60 req/min per IP)
```

### GET /links

```json
Response: {
  "links": [
    {
      "id": 1,
      "slug": "xK9mP2",
      "longUrl": "https://github.com/gaurav/project",
      "createdAt": "2026-06-26T07:00:00.000Z",
      "totalClicks": 14,
      "expiresAt": "2026-07-26T07:00:00.000Z"
    }
  ]
}
```

### DELETE /urls/:slug

```json
Response: { "message": "Link deleted successfully" }
          403 if the link belongs to another user
          404 if the slug does not exist
```

### GET /analytics/:slug

```json
Response: {
  "slug": "xK9mP2",
  "longUrl": "https://github.com/gaurav/project",
  "totalClicks": 14,
  "clicksByCountry": [{ "country": "IN", "count": 10 }],
  "clicksByDevice": [{ "device": "mobile", "count": 8 }],
  "recentClicks": [
    { "clickedAt": "2026-06-26T10:00:00.000Z", "country": "IN", "userAgent": "mobile", "referrer": null }
  ]
}
```

### GET /health

```json
Response: { "status": "ok", "db": "ok", "redis": "ok" }
          503 if either dependency is unreachable
```

---

## Performance Numbers (Local Dev)

| Endpoint             | Cold (cache miss) | Warm (cache hit) |
| -------------------- | ----------------- | ---------------- |
| GET /:slug           | ~50ms             | ~7ms             |
| GET /analytics/:slug | 15–80ms           | ~5ms             |

---

## What's Not Built Yet

- **Custom slugs** - let users choose their own short code
- **Link expiry UI** - show expiry countdown in the dashboard
- **Containerise the API** - add Node.js + worker services to docker-compose.yml for full Docker deployment
- **Structured logging** - replace console.log/error with pino or winston for JSON log output
- **DNS-resolution SSRF guard** - the current SSRF check blocks direct private IPs and known internal hostnames; a full guard would resolve hostnames via DNS and check the resulting IP against private ranges
