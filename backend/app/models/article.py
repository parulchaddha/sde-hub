from datetime import datetime
from sqlalchemy import String, Text, DateTime, Float, ARRAY, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    url: Mapped[str] = mapped_column(String(1000), unique=True, nullable=False, index=True)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    author: Mapped[str] = mapped_column(String(200), nullable=True)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    raw_content: Mapped[str] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[str] = mapped_column(String(1000), nullable=True)

    # Classification
    content_type: Mapped[str] = mapped_column(String(20), default="HLD", nullable=False)
    level: Mapped[str] = mapped_column(String(10), default="SDE-2", nullable=False, index=True)
    topics: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    category: Mapped[str] = mapped_column(String(20), default="engineering", nullable=False, index=True)

    # Scoring
    trending_score: Mapped[float] = mapped_column(Float, default=0.0)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    save_count: Mapped[int] = mapped_column(Integer, default=0)

    published_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_classified: Mapped[bool] = mapped_column(default=False)

    bookmarks: Mapped[list["Bookmark"]] = relationship("Bookmark", back_populates="article", lazy="select")


class ArticleTag(Base):
    __tablename__ = "article_tags"
    __table_args__ = (UniqueConstraint("article_id", "tag", name="uq_article_tag"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    article_id: Mapped[int] = mapped_column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), index=True)
    tag: Mapped[str] = mapped_column(String(100), nullable=False)
