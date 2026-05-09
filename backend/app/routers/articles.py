from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.article import Article
from app.models.user import User
from app.schemas.article import ArticleOut, FeedResponse
from app.services.deps import get_current_user, get_optional_user
from app.services.recommendation import get_feed, get_bookmarked_article_ids, increment_view

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/feed", response_model=FeedResponse)
def feed(
    level: str | None = Query(None, description="SDE-1, SDE-2, or SDE-3"),
    content_type: str | None = Query(None, alias="type", description="LLD, HLD, or Both"),
    topic: str | None = Query(None),
    category: str | None = Query(None, description="engineering or ai"),
    sort: str = Query("recent", description="recent or trending"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    articles, total = get_feed(db, current_user, level, content_type, topic, category, sort, page, page_size)

    bookmarked_ids: set[int] = set()
    if current_user:
        bookmarked_ids = get_bookmarked_article_ids(db, current_user.id)

    items = []
    for a in articles:
        out = ArticleOut.model_validate(a)
        out.is_bookmarked = a.id in bookmarked_ids
        items.append(out)

    return FeedResponse(
        articles=items,
        total=total,
        page=page,
        page_size=page_size,
        has_more=(page * page_size) < total,
    )


@router.get("/{article_id}", response_model=ArticleOut)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    increment_view(db, article_id)

    bookmarked = False
    if current_user:
        from app.models.bookmark import Bookmark
        bookmarked = db.query(Bookmark).filter(
            Bookmark.user_id == current_user.id,
            Bookmark.article_id == article_id,
        ).first() is not None

    out = ArticleOut.model_validate(article)
    out.is_bookmarked = bookmarked
    return out


@router.post("/admin/trigger-poll")
def trigger_poll(db: Session = Depends(get_db)):
    """Manual trigger for RSS poll — useful during development."""
    from app.services.rss_poller import poll_all_feeds
    total = poll_all_feeds(db)
    return {"new_articles": total, "message": f"Polled feeds. {total} new articles added."}
