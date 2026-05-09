import os
from pydantic_settings import BaseSettings


def _fix_postgres_url(url: str) -> str:
    """Railway provides postgres:// but SQLAlchemy requires postgresql://"""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    REDIS_URL: str = ""
    SECRET_KEY: str = "changeme"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    OPENAI_API_KEY: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = {"env_file": ".env"}

    @property
    def database_url_fixed(self) -> str:
        url = self.DATABASE_URL
        if not url:
            raise RuntimeError("DATABASE_URL environment variable is not set")
        return _fix_postgres_url(url)

    @property
    def redis_url_fixed(self) -> str:
        url = self.REDIS_URL
        if not url:
            raise RuntimeError("REDIS_URL environment variable is not set")
        return url


settings = Settings()
