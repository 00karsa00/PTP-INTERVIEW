# PTP — Full-Stack Portfolio Monorepo

Two production-grade POCs in a single repository, sharing consistent NestJS + React + TypeScript conventions across all services.

---

## Repository map

```
PTP/
├── docker-compose.yml          ← PostgreSQL (primary + replica) + RabbitMQ
│
│
├── pdp-backend/                NestJS · Port 3001
│   └── src/
│       ├── modules/
│       │   ├── recommendation/ ← AI-powered quiz engine (tested)
│       │   ├── products/       ← Product catalogue API
│       │   ├── wishlist/       ← Server-side wishlist (in-memory, tested)
│       │   └── marketplace/    ← 10-product marketplace catalogue
│       └── common/             filters · interceptors · config
│
├── pdp-frontend/               React 18 + Vite + Tailwind · Port 5174
│   └── src/
│       ├── pages/              ProductPage · MarketplacePage · CartPage · WishlistPage
│       ├── components/         pdp/ · ui/ · marketplace/
│       ├── hooks/              useRecommendation · useWishlist · useCart · useMarketplace
│       └── api/                recommendation · wishlist · marketplace
│
└── shopify-extension/          Shopify Theme App Extension (Liquid + Vanilla JS)
    └── extensions/ka-pdp-enhancements/
        ├── blocks/             routine-quiz.liquid
        └── assets/             routine-quiz.js · routine-quiz.css
```

---

## Projects at a glance

| | HRMS POC | Kerala Ayurveda PDP |
|---|---|---|
| **Purpose** | Enterprise leave management with scalable job processing | Shopify PDP enhancement — quiz, recommendation, wishlist, marketplace |
| **Backend port** | 3000 | 3001 |
| **Frontend port** | 5173 | 5174 |
| **Database** | PostgreSQL (primary + replica) | None (in-memory only) |
| **Queue** | RabbitMQ | — |
| **AI** | — | OpenAI gpt-4o-mini (optional, falls back to static) |
| **Tests** | — | Jest · 32 unit tests |
| **Currency** | — | INR (₹) |

---

## 1. Prerequisites

Install once, works for both projects.

| Tool | Min version | Check |
|------|------------|-------|
| Node.js | 20 | `node -v` |
| npm | 10 | `npm -v` |
| Docker + Docker Compose | 24 / v2 | `docker -v` |
| (Optional) Shopify CLI | 3 | `shopify version` |

---

## 2. HRMS POC — Quick start

### 2.1 Start infrastructure

```bash
# From repo root
docker compose up -d
```

Starts:
- PostgreSQL **primary** → `localhost:5432`
- PostgreSQL **replica** → `localhost:5433` (separate instance, simulates replica)
- RabbitMQ → `localhost:5672` (AMQP) · `localhost:15672` (Management UI)
  - Default credentials: `guest` / `guest`

Wait ~15 s for all health checks to pass before starting the backend.


## 3. Kerala Ayurveda PDP — Quick start

### 3.1 Environment

```bash
cd pdp-backend
cp .env.example .env
```

Open `.env` and set:

```ini
PORT=3001

# Optional — AI blurbs via OpenAI.
# Leave empty to use static fallback blurbs (no API key needed to run).
OPENAI_API_KEY=sk-...
```

### 3.2 Backend

```bash
cd pdp-backend
npm install
npm run start:dev      # http://localhost:3001
```

Endpoints available immediately:

```
POST   /api/v1/recommendation
GET    /api/v1/products/:handle
GET    /api/v1/marketplace
GET    /api/v1/marketplace/:handle
GET    /api/v1/wishlist?sessionId=xxx
POST   /api/v1/wishlist
DELETE /api/v1/wishlist
GET    /api/v1/wishlist/check
GET    /api/v1/health
```

### 3.3 Frontend

```bash
cd pdp-frontend
npm install
npm run dev            # http://localhost:5174
```

Vite is pre-configured to proxy `/api` → `localhost:3001` — no CORS issues in dev.

### 3.4 Run tests

```bash
cd pdp-backend
npm test              # runs all 32 tests, exits
npm run test:cov      # with coverage report
```

### 3.5 Shopify extension (optional)

```bash
# Requires Shopify CLI v3 + Partner account + development store
cd shopify-extension
shopify app dev --store your-store.myshopify.com
```

Or manually copy into an OS2-compatible theme:

```
blocks/routine-quiz.liquid   → theme/sections/
assets/routine-quiz.js       → theme/assets/
assets/routine-quiz.css      → theme/assets/
```

Then add to `theme.liquid`:
```liquid
{{ 'routine-quiz.css' | asset_url | stylesheet_tag }}
{{ 'routine-quiz.js'  | asset_url | script_tag }}
```

See `shopify-extension/docs/merchant-guide.md` for the full Shopify Admin setup.

---

## 4. PDP API reference

All responses are wrapped by `ResponseInterceptor`:
```jsonc
{ "success": true, "data": { ... }, "timestamp": "2025-..." }
```

Validation errors return HTTP 400:
```jsonc
{ "success": false, "statusCode": 400, "message": ["field must be ..."] }
```

### POST /api/v1/recommendation

Personalised routine + pack recommendation. Core feature — fully tested.

```jsonc
// Request
{
  "goal":      "stress_calm",   // "stress_calm" | "energy_focus" | "sleep_quality"
  "frequency": "once_daily",    // "once_daily"  | "twice_daily"
  "context":   "I travel a lot" // optional · max 200 chars
}

// Response data
{
  "goal":       "Stress & calm",
  "frequency":  "Once daily",
  "blurb":      "...",          // AI-generated or static fallback
  "blurbSource":"ai",           // "ai" | "fallback"
  "pack": {
    "title":    "Standard — 60 Capsules",
    "capsules": 60,
    "supply":   "2-month supply at once daily",
    "rationale":"..."
  },
  "routine": [
    { "time": "evening", "label": "Evening — Stress wind-down", "instruction": "..." }
  ],
  "disclaimer": "These statements have not been evaluated..."
}
```

### GET /api/v1/products/:handle

Returns product data for a handle (only `ashwagandha` currently).

### GET /api/v1/marketplace

Returns all 10 marketplace products. Supports optional query params:

| Param | Values | Example |
|-------|--------|---------|
| `category` | `adaptogen` `immunity` `digestion` `skincare` `hair` `sleep` `joint` `womens_health` | `?category=immunity` |
| `featured` | `true` | `?featured=true` |

### GET /api/v1/marketplace/:handle

Single product by handle, or `404`.

### GET /api/v1/wishlist

```
?sessionId=<uuid>
```

Returns `{ items: [...], count: N }`.

### POST /api/v1/wishlist

Adds a variant. Body:
```jsonc
{
  "sessionId":    "...",
  "variantId":    "standard-60",
  "variantTitle": "Standard",
  "productHandle":"ashwagandha",
  "productTitle": "Ashwagandha Capsules",
  "priceCents":   291600,
  "priceDisplay": "₹2,916",
  "capsules":     60,
  "available":    true
}
```

Returns `{ items, count, added: boolean }`.

### DELETE /api/v1/wishlist

Body: `{ sessionId, variantId, productHandle }` → `{ items, count, removed: boolean }`.

### GET /api/v1/wishlist/check

`?sessionId=...&variantId=...&productHandle=...` → `{ wishlisted: boolean }`.

---

## 5. Test coverage

```
pdp-backend/src/modules/
├── recommendation/recommendation.service.spec.ts   17 tests
│     pack selection · routine shape · label mapping
│     disclaimer presence · fallback blurb · no-treatment-claims
└── wishlist/wishlist.service.spec.ts               15 tests
      add · idempotent add · remove · idempotent remove
      session isolation · isWishlisted · 20-item cap
```

```bash
# Run with coverage
cd pdp-backend && npm run test:cov
```

---

## 6. Project structure (detailed)

### pdp-backend

```
src/
├── main.ts                          Bootstrap · CORS · ValidationPipe · port 3001
├── app.module.ts                    Global config · ThrottlerModule (30 req/60s)
├── config/configuration.ts          PORT · OPENAI_API_KEY · SHOPIFY_*
├── common/
│   ├── filters/http-exception.filter.ts
│   └── interceptors/response.interceptor.ts   { success, data, timestamp }
└── modules/
    ├── health/                      GET /api/v1/health
    ├── products/                    GET /api/v1/products/:handle
    │   └── products.service.ts      Mocked Ashwagandha data (INR paise)
    ├── recommendation/
    │   ├── recommendation.controller.ts
    │   ├── recommendation.service.ts   buildRecommendation() pure fn + OpenAI blurb
    │   ├── recommendation.service.spec.ts
    │   ├── data/routine-templates.ts   PACKS · ROUTINES · BLURB_FALLBACKS · DISCLAIMER
    │   └── dto/                        RecommendRequestDto · RecommendResponseDto
    ├── wishlist/
    │   ├── wishlist.controller.ts      GET · POST · DELETE · check
    │   ├── wishlist.service.ts         In-memory Map · add/remove/isWishlisted · 20-cap
    │   ├── wishlist.service.spec.ts
    │   └── dto/wishlist-item.dto.ts
    └── marketplace/
        ├── marketplace.controller.ts   GET list (filter) · GET :handle
        └── marketplace.service.ts      10 dummy products · INR prices · Unsplash images
```

### pdp-frontend

```
src/
├── App.tsx                  Client-side routing: product | marketplace | cart | wishlist
├── pages/
│   ├── ProductPage.tsx      PDP · variant selector · quiz · wishlist button
│   ├── MarketplacePage.tsx  10-card grid · category filter tabs · skeleton loader
│   ├── CartPage.tsx         Item list · qty controls · order summary · simulated checkout
│   └── WishlistPage.tsx     Server-synced list · remove · add-to-cart
├── components/
│   ├── pdp/                 ProductHero · VariantSelector · BenefitBullets · RoutineQuiz · IngredientsPanel
│   ├── ui/                  AddToCartButton · WishlistButton · Badge · Skeleton · StickyMobileBuyBar
│   └── marketplace/         ProductCard (image · stars · tags · wishlist heart · add btn)
├── hooks/
│   ├── useRecommendation.ts  POST /recommendation
│   ├── useProduct.ts         GET /products/:handle
│   ├── useWishlist.ts        useWishlistToggle (PDP) · useWishlistList (page)
│   ├── useCart.ts            In-memory cart (add · remove · updateQty · clear)
│   └── useMarketplace.ts     GET /marketplace with category filter
├── api/
│   ├── recommendation.ts     Axios + error unwrapping
│   ├── wishlist.ts           getSessionId() (localStorage) + CRUD calls
│   └── marketplace.ts        Filtered fetch
├── data/product.ts           Static fallback variants / benefits / disclaimer (INR)
└── types/
    ├── recommendation.ts
    ├── wishlist.ts
    └── marketplace.ts
```

### shopify-extension

```
extensions/ka-pdp-enhancements/
├── shopify.extension.toml          api_version 2024-10 · type: theme
├── blocks/
│   └── routine-quiz.liquid         App block · merchant schema (5 settings)
│                                   Reads quiz_config metaobject + benefit_bullets metafield
└── assets/
    ├── routine-quiz.js             ~5 KB IIFE · no deps · XSS-safe innerHTML · per-block isolation
    └── routine-quiz.css            Scoped under .ka-quiz-block · reduced-motion support
```

---

## 7. What is real vs mocked

### HRMS POC

| Item | Status |
|------|--------|
| RabbitMQ producer/consumer | **Real** |
| Worker thread pool | **Real** |
| CloudWatch CPU metrics | **Real** (requires AWS creds; falls back to simulated) |
| PostgreSQL primary/replica | **Simulated** — two separate identical instances; not true streaming replication |
| Leave accrual logic | **Real** business logic |
| Employee data | Seeded dummy data |

### Kerala Ayurveda PDP

| Item | Status |
|------|--------|
| Recommendation logic | **Real** — pure function, deterministic, fully tested |
| AI blurbs (gpt-4o-mini) | **Real** if `OPENAI_API_KEY` is set; otherwise static fallback |
| Wishlist API | **Real** NestJS service — but **in-memory** (not persisted across restarts) |
| Wishlist session | **Anonymous** — `crypto.randomUUID()` in localStorage; no auth |
| Marketplace catalogue | **Mocked** — 10 dummy products; Unsplash placeholder images |
| Product variants (30/60/90 caps) | **Assumed** — real product ships as single 60-cap SKU |
| Prices | **Illustrative** INR figures — not from live Shopify Storefront API |
| Add-to-cart | **Simulated** — React state only; replace with `/cart/add.js` in Shopify |
| Checkout | **Simulated** — 3 s fake success; no real order placed |
| Shopify metaobject fetch | **Mocked** — hardcoded in service; production would call Admin API |
| Product images | Unsplash placeholders |

---

## 8. HRMS API reference (quick)

```
# Infrastructure
GET  /api/v1/monitoring/health
GET  /api/v1/monitoring/dashboard
GET  /api/v1/monitoring/queues
GET  /api/v1/monitoring/workers
GET  /api/v1/monitoring/live           ← SSE stream

# Employees / Tenants
GET  /api/v1/employees/tenants
POST /api/v1/employees/seed            { tenantName, employeeCount }

# Leave Jobs
POST /api/v1/leave/accrual             { tenantId, month, year }
POST /api/v1/leave/monthly-balance     { tenantId, month, year }
GET  /api/v1/leave/accrual/:jobId
GET  /api/v1/leave/history/:tenantId
GET  /api/v1/leave/accrual/:jobId/stream ← SSE

# Reports
POST /api/v1/reports                   { tenantId, reportType }
GET  /api/v1/reports/:jobId
GET  /api/v1/reports/:jobId/logs
GET  /api/v1/reports/:jobId/progress   ← SSE
POST /api/v1/reports/:jobId/retry
```

---

## 9. Environment variables

### pdp-backend/.env

```ini
PORT=3001
OPENAI_API_KEY=          # optional — leave blank for static fallbacks
SHOPIFY_STORE_DOMAIN=    # optional — not used in current dev build
SHOPIFY_ADMIN_API_TOKEN= # optional — not used in current dev build
FRONTEND_URL=http://localhost:5174
```

### hrms-backend/.env (defaults already set for Docker)

```ini
PORT=3000
DB_PRIMARY_HOST=localhost
DB_PRIMARY_PORT=5432
DB_REPLICA_HOST=localhost
DB_REPLICA_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=hrms_poc
RABBITMQ_URL=amqp://guest:guest@localhost:5672
AWS_REGION=us-east-1       # CloudWatch (optional)
```

---

## 10. Common issues

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` on port 5432 / 5672 | `docker compose up -d` and wait for health checks |
| PDP frontend shows `Cannot reach server` | Make sure `pdp-backend` is running on port 3001 |
| Wishlist empty after restart | In-memory only — by design; add a DB for persistence |
| AI blurb always shows "fallback" | Set `OPENAI_API_KEY` in `pdp-backend/.env` |
| Shopify extension not in "Add block" | App must be installed; theme must be OS2 compatible |
| Port 3001 already in use | `lsof -i :3001` then kill the process |

---

## 11. Potential improvements

**HRMS**
- True PostgreSQL streaming replication (not simulated)
- Redis cache layer for hot employee lookups
- Kubernetes deployment with horizontal pod autoscaling
- Grafana + Prometheus instead of CloudWatch for local dev

**Kerala Ayurveda PDP**
- Persistent wishlist via PostgreSQL + authenticated users
- Live Shopify Storefront API for real prices, inventory, cart
- Shopify Admin API fetch for `routine_template` metaobjects
- Analytics — track goal → conversion funnel
- Product comparison view (Ashwagandha Tablets vs Capsules)

---

*Monorepo maintained for portfolio / evaluation purposes. All mocked data is clearly labelled throughout the codebase.*
