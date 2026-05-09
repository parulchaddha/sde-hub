from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import Base, engine
from app.routers import auth, articles, bookmarks


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs after uvicorn binds to the port — errors are visible in logs
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        conn.execute(text(
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS "
            "category VARCHAR(20) DEFAULT 'engineering' NOT NULL"
        ))
        conn.commit()
    yield
    # Shutdown: dispose connection pool cleanly
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
