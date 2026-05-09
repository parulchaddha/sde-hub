from celery import Celery
from celery.schedules import crontab
from app.config import settings

celery_app = Celery(
    "sde_hub",
    broker=settings.redis_url_fixed,
    backend=settings.redis_url_fixed,
    include=["app.tasks.poll_feeds"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "poll-rss-feeds-hourly": {
            "task": "app.tasks.poll_feeds.poll_all_feeds_task",
            "schedule": crontab(minute=0),  # every hour
        },
    },
)
