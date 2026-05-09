from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://sdehub:sdehubpass@db:5432/sdehub"
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "changeme"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    OPENAI_API_KEY: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = {"env_file": ".env"}


settings = Settings()
