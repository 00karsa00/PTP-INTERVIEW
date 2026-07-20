# PDP Backend — Kerala Ayurveda Ashwagandha

NestJS recommendation API that powers the "Is this right for me?" routine quiz.

## Quick start

```bash
cd pdp-backend
cp .env.example .env          # fill in OPENAI_API_KEY if you want live AI blurbs
npm install
npm run start:dev             # runs on :3001
```

## API

### POST /api/v1/recommendation

**Request**
```json
{
  "goal": "stress_calm | energy_focus | sleep_quality",
  "frequency": "once_daily | twice_daily",
  "context": "(optional string, max 200 chars)"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "goal": "Stress & calm",
    "frequency": "Once daily",
    "blurb": "2-3 sentence personalised note (AI or fallback)",
    "blurbSource": "ai | fallback",
    "pack": { "title": "...", "capsules": 60, "supply": "...", "rationale": "..." },
    "routine": [{ "time": "evening", "label": "...", "instruction": "..." }],
    "disclaimer": "These statements have not been evaluated..."
  },
  "timestamp": "2024-..."
}
```

**Errors** — all errors follow the same shape:
```json
{ "success": false, "statusCode": 400, "message": "...", "path": "...", "timestamp": "..." }
```

## Running tests

```bash
npm test          # single run, exits
npm run test:cov  # with coverage
```

## What is real vs mocked

| Item | Status |
|------|--------|
| Recommendation logic (pack/routine selection) | Real — deterministic, fully tested |
| AI blurb via gpt-4o-mini | Real if OPENAI_API_KEY set; falls back to static template |
| Pack variants (30/60/90 cap tiers) | **ASSUMED** — real product ships as 60-cap only |
| Routine templates | **ASSUMED** — grounded in Kerala Ayurveda's published guidance |
| Shopify metaobject fetch | **MOCKED** — in prod would call Admin API; uses hardcoded data in dev |
