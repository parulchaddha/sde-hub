import logging
from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.services.rss_poller import poll_all_feeds

logger = logging.getLogger(__name__)


@celery_app.task(name="app.tasks.poll_feeds.poll_all_feeds_task")
def poll_all_feeds_task():
    """Celery task: poll all RSS feeds and classify new articles."""
    db = SessionLocal()
    try:
        total = poll_all_feeds(db)
        logger.info("RSS poll complete. New articles: %d", total)
        return {"new_articles": total}
    except Exception as e:
        logger.error("RSS poll failed: %s", e)
        raise
    finally:
        db.close()
