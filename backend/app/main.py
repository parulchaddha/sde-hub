from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import Base, engine
from app.routers import auth, articles, bookmarks

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Idempotent column migrations for existing DBs
with engine.connect() as _conn:
    _conn.execute(text(
        "ALTER TABLE articles ADD COLUMN IF NOT EXISTS category VARCHAR(20) DEFAULT 'engineering' NOT NULL"
    ))
    _conn.commit()

app = FastAPI(
    title="SDE Hub API",
    description="Personalized system design content feed for engineers",
    version="0.1.0",
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
