# Wrap — URL Shortener with Click Analytics

A production-grade URL shortener built to learn core backend engineering concepts — PostgreSQL, Redis, BullMQ, Docker, and TypeScript. Built project-first, concept-by-concept.

---

## What This Project Does

- Shorten any long URL into a 6-character slug
- Redirect users instantly via a Redis cache-aside pattern (~7ms)
- Track click analytics asynchronously without blocking the redirect
- Serve aggregated analytics (total clicks, by country, by device) with Redis caching (~5ms)

---

## Architecture

```
POST /shorten     → Zod validation → nanoid slug → PostgreSQL → Redis warm → 201
GET /:slug        → Redis HIT (~7ms) or MISS → PostgreSQL → Redis heal → 302
                    → async: BullMQ job pushed after redirect
                         ↓
                    Worker picks up job → INSERT into clicks table
GET /analytics/:slug → Redis HIT (5ms) or MISS → 4 parallel PG queries → Redis cache → 200
```

### Why Each Tool Was Chosen

| Tool | Job | Why not something else |
|---|---|---|
| PostgreSQL | Source of truth — users, urls, clicks | Relational integrity between tables. Foreign keys, cascade deletes. SQL aggregations for analytics. |
| Prisma | Type-safe DB queries + migrations | Auto-generates TypeScript types from schema. Migration files track schema changes. |
| Redis | Cache + BullMQ backend | RAM-based (~0.1ms reads). Shared across all Node.js instances — unlike in-process memory. |
| BullMQ | Async job queue for analytics | Decouples analytics write latency from redirect response. Worker failure never affects redirects. |
| Zod | Input validation | Runtime validation + TypeScript type inference from one schema definition. |
| nanoid | Slug generation | Random 6-char slug. No DB round-trip needed to generate. Collision handled via retry + P2002. |
| Docker Compose | Local dev environment | PostgreSQL and Redis run as containers. No local installs needed. |

---

## Database Schema

### users
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | SERIAL | PRIMARY KEY | Auto-increment |
| email | VARCHAR(255) | UNIQUE NOT NULL | |
| passwordHash | TEXT | NOT NULL | bcrypt hash — never store plain text |
| createdAt | TIMESTAMPTZ | DEFAULT NOW() | |

### urls
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | SERIAL | PRIMARY KEY | Auto-increment |
| slug | VARCHAR(10) | UNIQUE NOT NULL | Indexed — fast lookup on redirect |
| longUrl | TEXT | NOT NULL | Original URL |
| userId | INTEGER | FK → users(id), NULLABLE | Null for anonymous links |
| expiresAT | TIMESTAMPTZ | NOT NULL | 30-day expiry set on creation |
| createdAt | TIMESTAMPTZ | DEFAULT NOW() | |

### clicks (analytics)
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | BIGINT | PRIMARY KEY | BIGSERIAL — this table grows large |
| urlId | INTEGER | FK → urls(id) ON DELETE CASCADE | Cascade: delete URL → all clicks deleted |
| clickedAt | TIMESTAMPTZ | DEFAULT NOW() | Indexed (composite) |
| ipAddress | TEXT | NULLABLE | |
| userAgent | TEXT | NULLABLE | Stores parsed device type after UA parsing |
| country | TEXT | NULLABLE | From cf-ipcountry header in production |
| referrer | TEXT | NULLABLE | |

### Indexes
```sql
-- Auto-created by @unique on slug
CREATE UNIQUE INDEX ON "Url"("slug");

-- Manually added composite index for analytics queries
CREATE INDEX "Click_urlId_clickedAt_idx" ON "Click"("urlId", "clickedAt" DESC);
```

**Why the composite index?** Every analytics query filters by `urlId` and sorts by `clickedAt DESC`. Without the index, PostgreSQL scans the entire clicks table and sorts in memory. With it, rows are pre-grouped by `urlId` and pre-sorted — no scan, no sort.

---

## Key Concepts Learned

### 1. Cache-Aside Pattern (Redis)
Check cache first. On HIT → serve from Redis. On MISS → query PostgreSQL, write result back to Redis, serve. Cache heals itself on miss.

```
Redis GET url:slug
  ├── HIT  → redirect (0.1ms RAM read)
  └── MISS → PostgreSQL → Redis SET url:slug (re-warm) → redirect
```

**Key insight:** Redis must live outside Node.js processes. In-process memory only works for a single instance. Redis is shared across all instances — essential for horizontal scaling.

**Key namespacing:** Keys are stored as `url:slug`, `analytics:slug`, not raw values. Prevents collisions across features in the flat Redis keyspace.

### 2. Async Analytics with BullMQ
After `res.redirect()` is sent — the user is already gone — the API pushes a job to BullMQ. A separate worker process picks it up and writes to the clicks table.

```typescript
res.redirect(302, cachedUrl)      // user is gone
void clickQueue.add('click', ...) // fires after, not awaited intentionally
```

`void` tells TypeScript: "I know this is a Promise and I'm deliberately not awaiting it." The event loop keeps running after the response is sent. The job is pushed asynchronously.

**Why separate process?** If the worker crashes, redirects keep working. Worker failures are isolated from the hot path.

### 3. BullMQ Retry with Exponential Backoff
```typescript
defaultJobOptions: {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,   // 1s → 2s → 4s
  },
  removeOnComplete: true,
  removeOnFail: false,  // keep failed jobs for inspection
}
```

- `attempts: 3` → job retried exactly 3 times on failure
- `exponential` → delay doubles each retry (1s, 2s, 4s)
- `removeOnFail: false` → failed jobs stay in Redis as dead-letter jobs

**Why exponential?** Flat retries hammer a struggling service. Exponential backoff gives the system time to recover between attempts.

### 4. Foreign Key + ON DELETE CASCADE
```prisma
url Url @relation(fields: [urlId], references: [id], onDelete: Cascade)
```

If a URL row is deleted, all its Click rows are automatically deleted. Without this, you'd have orphaned click records pointing to non-existent URLs — broken data.

### 5. Promise.all for Parallel Queries
Analytics queries are independent — none depends on another's result. Run them in parallel:

```typescript
// Sequential — total time = sum of all queries (bad)
const a = await query1()
const b = await query2()

// Parallel — total time = slowest single query (good)
const [a, b] = await Promise.all([query1(), query2()])
```

### 6. nanoid vs Base62 — The Tradeoff
| | nanoid | Base62 |
|---|---|---|
| How | Random 6-char string | Encode PostgreSQL serial ID |
| DB calls | 1 (insert only) | 2 (insert + update with slug) |
| Uniqueness | Probabilistic (collision → retry) | Deterministic (guaranteed by PK) |
| Interview answer | Simpler, fine at our scale | Better at high write throughput — no retry loop |

### 7. HTTP 302 vs 301
- **301 Permanent** → browser caches redirect forever. Subsequent clicks bypass your server entirely. Analytics break.
- **302 Temporary** → browser always checks back. Every click hits your server. Analytics work correctly.

Always use **302** when you need to track clicks.

### 8. Analytics Caching (30s TTL)
Computing GROUP BY across millions of clicks on every dashboard refresh is wasteful. Cache the computed result:

```
First request  → PostgreSQL (4 queries, 15-80ms) → cache result in Redis
Next 30 seconds → Redis HIT (5ms, zero DB queries)
```

Tradeoff: dashboard is stale by at most 30 seconds. Acceptable for analytics. Reduces DB queries by ~98% under concurrent load.

### 9. Global Error Handler
Four-parameter Express middleware catches all errors passed via `next(error)`:

```typescript
app.use(errorHandler) // must be registered AFTER all routes
```

Stack traces are logged server-side, never exposed to the client. Security baseline for any production API.

---

## Request Flows

### POST /shorten
```
1. Zod validates { longUrl, userId? }
2. nanoid generates 6-char slug
3. Prisma inserts into Url table (retry on P2002 collision, max 3 attempts)
4. Redis SET url:slug → { longUrl, urlId } with 24h TTL
5. Return { shortUrl, slug }
```

### GET /:slug
```
1. Redis GET url:slug
   ├── HIT  → res.redirect(302, longUrl) → push BullMQ job → return
   └── MISS → Prisma findUnique by slug
               ├── null → 404
               └── found → Redis SET (re-warm) → res.redirect(302) → push BullMQ job
2. BullMQ worker (separate process):
   → UAParser parses userAgent → prisma.click.create()
```

### GET /analytics/:slug
```
1. Redis GET analytics:{slug}
   ├── HIT  → return cached result (5ms)
   └── MISS → Promise.all([count, groupByCountry, groupByDevice, recentClicks])
               → Redis SET analytics:{slug} with 30s TTL
               → return result
```

---

## Project Structure

```
src/
  config/
    db.ts          ← Prisma client singleton
    redis.ts       ← ioredis client + event listeners
    queue.ts       ← BullMQ queue instance with retry config
  controllers/
    shorten.controller.ts
    redirect.controller.ts
    analytics.controller.ts
  services/
    url.service.ts        ← createShortUrl, getUrlBySlug
    cache.service.ts      ← getCachedUrl, setCachedUrl, deleteCachedUrl
    analytics.service.ts  ← getUrlAnalytics with Redis caching
  workers/
    click.worker.ts       ← BullMQ worker, UA parsing, prisma.click.create
  routes/
    index.ts              ← POST /shorten, GET /analytics/:slug, GET /:slug
  middleware/
    error.middleware.ts   ← global error handler
  schemas/
    shorten.schema.ts     ← Zod schema + inferred ShortenRequest type
  types/
    index.ts              ← ClickEvent interface
  utils/
    base62.ts             ← base62 encode utility (reference, nanoid used instead)
  app.ts                  ← Express setup, middleware, routes
  server.ts               ← entry point
prisma/
  schema.prisma           ← single source of truth for DB structure
  migrations/             ← auto-generated SQL migration files
docker-compose.yml        ← postgres + redis containers
```

---

## Running Locally

**Prerequisites:** Docker Desktop, Node.js 20+

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL and Redis containers
docker compose up -d

# 3. Run migrations
npx prisma migrate dev

# 4. Start API server (Terminal 1)
npm run dev

# 5. Start BullMQ worker (Terminal 2)
npm run worker
```

**Environment variables (.env):**
```env
PORT=3000
DATABASE_URL="postgresql://wrap_admin:wrap_password@localhost:5432/wrap_db"
REDIS_URL="redis://localhost:63790"
REDIS_HOST="localhost"
REDIS_PORT=63790
```

---

## API Reference

### POST /shorten
```json
Request:  { "longUrl": "https://github.com/gaurav/project", "userId": 1 }
Response: { "message": "Short URL created successfully", "shortUrl": "http://localhost:3000/xK9mP2", "slug": "xK9mP2" }
```

### GET /:slug
```
Response: 302 redirect to longUrl
Header:   Location: https://github.com/gaurav/project
```

### GET /analytics/:slug
```json
Response: {
  "slug": "xK9mP2",
  "longUrl": "https://github.com/gaurav/project",
  "totalClicks": 14,
  "clicksByCountry": [{ "country": "IN", "count": 10 }],
  "clicksByDevice": [{ "device": "desktop", "count": 14 }],
  "recentClicks": [{ "clickedAt": "...", "ipAddress": "...", ... }]
}
```

### GET /health
```json
Response: { "message": "Server is healthy" }
```

---

## Performance Numbers (Local Dev)

| Endpoint | Cold (cache miss) | Warm (cache hit) |
|---|---|---|
| GET /:slug | ~50ms | ~7ms |
| GET /analytics/:slug | 15–80ms | ~5ms |

---

## What's Not Built Yet (Next Steps)

- **Auth** — JWT + Redis session for protected routes (Project 2)
- **Graceful shutdown** — worker finishes current job before process exits
- **Link expiry enforcement** — check `expiresAt` on redirect
- **Rate limiting** — Redis sliding window to prevent redirect abuse
- **Containerise the API** — add Node.js service to docker-compose.yml for full Docker deployment
