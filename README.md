# SDE Hub

Personalized system design content feed for engineers — curated by level (SDE-1, SDE-2, SDE-3), powered by RSS aggregation and OpenAI GPT-4o-mini classification.

## Architecture

```
sde-hub/
├── backend/          FastAPI + Celery (Python)
├── frontend/         Next.js 15 + Tailwind CSS (TypeScript)
└── docker-compose.yml  Postgres 16 + Redis 7
```

## Quick Start

### 1. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `OPENAI_API_KEY` — your OpenAI API key (used for article classification + summarization)
- `SECRET_KEY` — any long random string for JWT signing

### 2. Start the backend services

```bash
docker compose up --build
```

This starts:
- **Postgres** on `localhost:5432`
- **Redis** on `localhost:6379`
- **FastAPI** backend on `http://localhost:8000`
- **Celery worker + beat** (polls RSS feeds every hour)

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### 4. Trigger an initial RSS poll

Once the backend is running, seed the feed:

```bash
curl -X POST http://localhost:8000/articles/admin/trigger-poll
```

Or click **"Refresh feed"** in the sidebar once you're logged in.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Login, get JWT |
| GET | `/auth/me` | Current user profile |
| PUT | `/auth/onboarding` | Set level + topics |
| GET | `/articles/feed` | Paginated feed with filters |
| GET | `/articles/{id}` | Single article detail |
| POST | `/articles/admin/trigger-poll` | Manually trigger RSS poll |
| GET | `/bookmarks/` | List saved articles |
| POST | `/bookmarks/{id}` | Save article |
| DELETE | `/bookmarks/{id}` | Remove bookmark |

### Feed query parameters

| Param | Values | Default |
|---|---|---|
| `level` | `SDE-1`, `SDE-2`, `SDE-3` | user's level |
| `type` | `LLD`, `HLD`, `Both` | all |
| `sort` | `recent`, `trending` | `recent` |
| `page` | integer | `1` |
| `page_size` | 1–50 | `20` |

---

## RSS Sources (Phase 1)

| Source | Type |
|---|---|
| ByteByteGo Newsletter | HLD |
| High Scalability | HLD case studies |
| Netflix Tech Blog | HLD, distributed systems |
| Uber Engineering | HLD, infrastructure |
| Martin Fowler | LLD, patterns |
| Arpit Bhayani (Substack) | LLD deep dives |
| InfoQ Architecture | LLD + HLD |
| dev.to #systemdesign | Community |
| Meta Engineering | HLD |
| Discord Engineering | HLD case studies |

---

## Phase 2 Roadmap

- [ ] Fine-tune Mistral-7B classifier (replace GPT-4o-mini)
- [ ] Vector embeddings + content-based recommendations (Qdrant)
- [ ] "Trending this week" section per level
- [ ] Weekly email digest (Resend)
- [ ] Interview experience parser (Reddit/Blind scraper)
- [ ] Company-specific prep mode
