from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.models.article import Article
from app.models.bookmark import Bookmark
from app.models.user import User


def get_trending_score(article: Article) -> float:
    """Score based on saves, views, and recency."""
    age_hours = max(1, (datetime.utcnow() - (article.published_at or article.created_at)).total_seconds() / 3600)
    engagement = (article.save_count * 3) + article.view_count
    return engagement / (age_hours ** 1.2)


def get_feed(
    db: Session,
    user: User | None,
    level: str | None = None,
    content_type: str | None = None,
    topic: str | None = None,
    category: str | None = None,
    sort: str = "recent",
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[Article], int]:
    """Return paginated, filtered articles. Personalized if user provided."""

    query = db.query(Article)

    # Category filter (engineering vs ai)
    if category:
        query = query.filter(Article.category == category)

    # Level filter — use user's level if not explicitly specified
    effective_level = level or (user.level if user else None)
    if effective_level:
        query = query.filter(Article.level == effective_level)

    # Skip content_type filter for AI articles (they use "AI" type, not LLD/HLD)
    if content_type and category != "ai":
        query = query.filter(Article.content_type == content_type)

    if topic:
        query = query.filter(Article.topics.any(topic))

    # Sorting
    if sort == "trending":
        # Trending: high engagement in last 7 days
        cutoff = datetime.utcnow() - timedelta(days=7)
        query = query.filter(Article.published_at >= cutoff)
        query = query.order_by(
            desc(Article.save_count * 3 + Article.view_count),
            desc(Article.published_at),
        )
    else:
        query = query.order_by(desc(Article.published_at))

    total = query.count()
    articles = query.offset((page - 1) * page_size).limit(page_size).all()

    return articles, total


def get_bookmarked_article_ids(db: Session, user_id: int) -> set[int]:
    rows = db.query(Bookmark.article_id).filter(Bookmark.user_id == user_id).all()
    return {r[0] for r in rows}


def increment_view(db: Session, article_id: int):
    db.query(Article).filter(Article.id == article_id).update(
        {Article.view_count: Article.view_count + 1}
    )
    db.commit()
