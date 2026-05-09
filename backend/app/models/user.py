from datetime import datetime
from sqlalchemy import String, DateTime, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=True)
    # SDE-1, SDE-2, SDE-3
    level: Mapped[str] = mapped_column(String(10), default="SDE-1", nullable=False)
    # e.g. ["Caching", "Databases", "Messaging"]
    preferred_topics: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    bookmarks: Mapped[list["Bookmark"]] = relationship("Bookmark", back_populates="user", lazy="select")
