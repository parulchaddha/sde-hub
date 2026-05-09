from datetime import datetime
from pydantic import BaseModel


class ArticleOut(BaseModel):
    id: int
    title: str
    url: str
    source: str
    author: str | None
    summary: str | None
    thumbnail_url: str | None
    content_type: str
    level: str
    topics: list[str]
    category: str = "engineering"
    trending_score: float
    view_count: int
    save_count: int
    published_at: datetime | None
    is_bookmarked: bool = False

    model_config = {"from_attributes": True}


class FeedResponse(BaseModel):
    articles: list[ArticleOut]
    total: int
    page: int
    page_size: int
    has_more: bool
