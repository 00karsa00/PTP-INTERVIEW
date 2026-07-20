# Kerala Ayurveda — Shopify PDP Enhancement

**Product:** Ashwagandha Capsules + 10-product marketplace  
**Features:** Routine quiz · AI recommendation · Wishlist · Cart · Marketplace  
**Stack:** NestJS (backend) · React + Vite + Tailwind (frontend) · Shopify Liquid (theme extension)  
**Currency:** INR (₹)

---

## Repository structure

```
PTP/
├── pdp-backend/                  NestJS API (Port 3001)
│   └── src/
│       ├── modules/
│       │   ├── recommendation/
│       │   │   ├── recommendation.controller.ts
│       │   │   ├── recommendation.service.ts       ← AI blurb + pure logic
│       │   │   ├── recommendation.service.spec.ts  ← 17 tests
│       │   │   ├── data/routine-templates.ts
│       │   │   └── dto/
│       │   ├── products/                           ← GET /products/:handle
│       │   ├── wishlist/
│       │   │   ├── wishlist.controller.ts          ← GET/POST/DELETE/check
│       │   │   ├── wishlist.service.ts             ← In-memory store
│       │   │   ├── wishlist.service.spec.ts        ← 15 tests
│       │   │   └── dto/
│       │   └── marketplace/
│       │       ├── marketplace.controller.ts       ← GET list + GET :handle
│       │       └── marketplace.service.ts          ← 10 dummy products
│       └── common/                                 filters · interceptors
│
├── pdp-frontend/                 React 18 + Vite + Tailwind (Port 5174)
│   └── src/
│       ├── pages/
│       │   ├── ProductPage.tsx         ← PDP with wishlist button
│       │   ├── MarketplacePage.tsx     ← 10-card grid + category filter
│       │   ├── CartPage.tsx            ← Items · qty · order summary · checkout
│       │   └── WishlistPage.tsx        ← Server-synced wishlist
│       ├── components/
│       │   ├── pdp/                    ProductHero · VariantSelector · RoutineQuiz · …
│       │   ├── ui/                     AddToCartButton · WishlistButton · Badge · Skeleton
│       │   └── marketplace/            ProductCard (image · stars · heart · add btn)
│       ├── hooks/                      useRecommendation · useWishlist · useCart · useMarketplace
│       └── api/                        recommendation · wishlist · marketplace
│
└── shopify-extension/            Shopify Theme App Extension
    └── extensions/ka-pdp-enhancements/
        ├── blocks/routine-quiz.liquid  ← App block · merchant schema
        ├── assets/routine-quiz.js      ← Vanilla JS · ~5 KB · no deps
        └── assets/routine-quiz.css     ← Scoped design tokens
```

---

## Setup

### Prerequisites

- Node 20+
- `npm`
- (Optional) OpenAI API key for live AI blurbs

### 1. Backend

```bash
cd pdp-backend
cp .env.example .env
# Set OPENAI_API_KEY=sk-... for live AI blurbs (omit for static fallbacks)
npm install
npm run start:dev      # http://localhost:3001
```

### 2. Frontend

```bash
cd pdp-frontend
npm install
npm run dev            # http://localhost:5174
# Vite proxies /api → :3001 automatically
```

### 3. Shopify extension (optional)

```bash
cd shopify-extension
shopify app dev --store your-store.myshopify.com
```

See `shopify-extension/docs/merchant-guide.md` for Admin setup instructions.

---

## Running tests

```bash
cd pdp-backend
npm test          # 32 tests, exits after one run
npm run test:cov  # with coverage report
```

| File | Tests | Covers |
|------|-------|--------|
| `recommendation.service.spec.ts` | 17 | All 6 goal×freq combinations · pack selection · labels · disclaimer · AI fallback · no-treatment-claims |
| `wishlist.service.spec.ts` | 15 | Add · idempotent add · remove · session isolation · isWishlisted · 20-item cap |

---

## API

All responses: `{ success: true, data: {...}, timestamp: "..." }`  
Errors: `{ success: false, statusCode: 400, message: [...] }`

### POST /api/v1/recommendation

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
  "blurb":      "...",
  "blurbSource":"ai",           // "ai" | "fallback"
  "pack": { "title": "Standard — 60 Capsules", "capsules": 60, "supply": "...", "rationale": "..." },
  "routine":   [{ "time": "evening", "label": "...", "instruction": "..." }],
  "disclaimer": "These statements have not been evaluated..."
}
```

### GET /api/v1/products/:handle

Returns full product data for `ashwagandha`. Prices in INR paise.

### GET /api/v1/marketplace

Query params: `?category=adaptogen|immunity|digestion|skincare|hair|sleep|joint|womens_health` · `?featured=true`

Returns `{ products: [...], total: N, dataSource: "mocked" }`.

### GET /api/v1/marketplace/:handle

Single marketplace product or `404`.

### GET /api/v1/wishlist?sessionId=xxx

Returns `{ items: [...], count: N }`.

### POST /api/v1/wishlist

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

### GET /api/v1/wishlist/check?sessionId=&variantId=&productHandle=

Returns `{ wishlisted: boolean }`.

### GET /api/v1/health

Returns `{ status: "ok" }`.

---

## What is real vs mocked

| Item | Status | Notes |
|------|--------|-------|
| Recommendation logic | **Real** | Pure function, deterministic, fully tested |
| AI blurbs (gpt-4o-mini) | **Real** if key set | Falls back to static template when key absent or call fails |
| Wishlist API | **Real** NestJS | **In-memory** — not persisted across server restarts |
| Wishlist session | **Anonymous** | `crypto.randomUUID()` stored in localStorage; no auth |
| Marketplace catalogue | **Mocked** | 10 dummy products; Unsplash placeholder images |
| Product variants (30/60/90) | **Assumed** | Real product ships as single 60-cap SKU |
| Prices | **Illustrative INR** | Not from live Shopify Storefront API |
| Add-to-cart | **Simulated** | React state; replace with `/cart/add.js` in Shopify |
| Checkout | **Simulated** | 3 s fake success; no real order placed |
| Shopify metaobject fetch | **Mocked** | Would call Admin API in production |
| Product images | **Placeholder** | Unsplash stock photos |

---

## Architecture decisions

**Why NestJS for a small API?**  
Same stack as `hrms-backend` — consistent `ValidationPipe`, `ResponseInterceptor`, `HttpExceptionFilter`. No context-switching cost.

**Why separate `pdp-backend` from `hrms-backend`?**  
Different domain, different dependency (OpenAI), different port. Each service is independently deployable without touching the other.

**Why in-memory wishlist?**  
Avoids a database dependency for this demo. The service layer is intentionally separate from the controller so swapping the store to PostgreSQL requires only changes to `wishlist.service.ts`.

**Why vanilla JS in the Shopify extension?**  
Shopify's theme JS budget is tight. Zero-dependency vanilla JS keeps the block portable across themes and avoids bundler setup. The React prototype handles developer UX; the Liquid/JS handles production Shopify.

**Why gpt-4o-mini?**  
Cheapest capable model for 2–3 sentence blurbs. Latency <2 s P95. The fallback is always-ready so a slow or failed AI call never blocks the quiz result.

**AI blurb safety**
- System prompt explicitly forbids disease-treatment claims, guaranteed outcomes, and fabricated certifications.
- User-supplied `context` is sanitised (regex strip non-printables, 200-char truncation) before reaching the prompt.
- Fallback blurbs are human-written, contain no prohibited claims.

---

## Performance

- Skeleton loaders on quiz submit and marketplace load — prevents layout shift
- `loading="lazy"` on all marketplace card images
- Axios 15 s timeout; ThrottlerModule 30 req / 60 s per IP
- CSS-only animations (`@keyframes` + Tailwind); `prefers-reduced-motion` respected
- Per-block JS isolation — multiple quiz blocks on one page are safe

---

## Merchant configurability (Shopify extension)

| Property | Where | Scope |
|----------|-------|-------|
| Benefit bullets | Product Admin → Metafields → `custom.benefit_bullets` | Per-product |
| Quiz questions & options | Admin → Custom data → Metaobjects → `quiz_config` | Per section |
| Routine copy & pack | Admin → Custom data → Metaobjects → `routine_template` | Backend-driven |
| Heading / Subheading | Theme Editor | Per section |
| API endpoint URL | Theme Editor | Per section |
| FDA disclaimer toggle | Theme Editor | Per section |

---

## Limitations

- Wishlist data lost on server restart (in-memory only)
- No Shopify Storefront API — price, inventory, cart are simulated
- Marketplace products are dummy data; no live product sync
- Shopify extension assumes a Dawn-compatible OS2 theme

## What I'd build next

1. **Persistent wishlist** — PostgreSQL + authenticated users
2. **Live Storefront API** — real prices, inventory, cart via `@shopify/storefront-api-client`
3. **Shopify Admin API** — fetch `routine_template` metaobjects on startup, cache with TTL
4. **Marketplace search** — full-text search across product titles and tags
5. **Analytics** — track goal → pack → conversion funnel
