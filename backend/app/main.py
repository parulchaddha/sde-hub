import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import Base, engine
from app.routers import auth, articles, bookmarks


async def _poll_loop():
    """Run RSS polling once on startup, then every hour."""
    from app.services.rss_poller import poll_all_feeds
    while True:
        try:
            await asyncio.to_thread(poll_all_feeds)
        except Exception as e:
            print(f"[poll_loop] error: {e}", flush=True)
        await asyncio.sleep(3600)  # 1 hour


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        conn.execute(text(
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS "
            "category VARCHAR(20) DEFAULT 'engineering' NOT NULL"
        ))
        conn.commit()

    # Start background polling loop (replaces the Celery worker)
    poll_task = asyncio.create_task(_poll_loop())

    yield

    poll_task.cancel()
    try:
        await poll_task
    except asyncio.CancelledError:
        pass
    engine.dispose()


app = FastAPI(
    title="SDE Hub API",
    description="Personalized system design content feed for engineers",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(articles.router)
app.include_router(bookmarks.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "sde-hub-api"}
