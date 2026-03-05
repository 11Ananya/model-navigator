# InfraLens

Model selection for AI builders who care about the details.

InfraLens takes your task requirements and hardware constraints and recommends the right open-source LLM — with explicit reasoning, not just a leaderboard rank.

## What it does

Most model selection is guesswork. InfraLens runs your use case through a multi-step pipeline:

1. **Constraint filtering** — eliminates models that don't fit your VRAM, latency, or license requirements
2. **HuggingFace enrichment** — pulls live model metadata (parameters, architecture, downloads, recency)
3. **LLM reranking** — Claude reasons through the remaining candidates and ranks them against your specific use case
4. **Ranked output** — primary recommendation + alternatives, each with tradeoffs explained

## Stack

**Frontend**
- React + TypeScript + Vite
- Supabase (auth + storage)
- Tailwind CSS

**Backend**
- Node + Hono
- Anthropic SDK (Claude for reranking)
- HuggingFace API (live model data)

## Running locally

### Prerequisites
- Node 18+
- Anthropic API key
- HuggingFace API token
- Supabase project

### Frontend

```bash
cd model-navigator
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL
npm run dev
```

### Backend

```bash
cd model-navigator/server
npm install
cp .env.example .env   # fill in ANTHROPIC_API_KEY, HF_TOKEN, FRONTEND_ORIGIN
npm run dev
```

## Environment variables

**Frontend (`.env`)**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:3000
```

**Backend (`server/.env`)**
```
ANTHROPIC_API_KEY=
HF_TOKEN=
FRONTEND_ORIGIN=http://localhost:5173
PORT=3000
```

## Deployment

- Frontend → Vercel
- Backend → Railway (set Root Directory to `server`)

## Contributing

If the reasoning breaks down for your use case or a model you care about is missing, open an issue or a PR. Especially interested in:
- Edge cases where constraint filtering is too aggressive
- Models that should be in the catalog but aren't
- Reranking prompts that produce better tradeoff explanations
