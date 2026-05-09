from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.article import Article
from app.models.bookmark import Bookmark
from app.models.user import User
from app.schemas.article import ArticleOut
from app.services.deps import get_current_user

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("/", response_model=list[ArticleOut])
def list_bookmarks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookmarks = (
        db.query(Bookmark)
        .filter(Bookmark.user_id == current_user.id)
        .order_by(Bookmark.created_at.desc())
        .all()
    )
    result = []
    for b in bookmarks:
        out = ArticleOut.model_validate(b.article)
        out.is_bookmarked = True
        result.append(out)
    return result


@router.post("/{article_id}", status_code=status.HTTP_201_CREATED)
def add_bookmark(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.article_id == article_id,
    ).first()
    if existing:
        return {"message": "Already bookmarked"}

    bookmark = Bookmark(user_id=current_user.id, article_id=article_id)
    db.add(bookmark)
    article.save_count += 1
    db.commit()
    return {"message": "Bookmarked"}


@router.delete("/{article_id}", status_code=status.HTTP_200_OK)
def remove_bookmark(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.article_id == article_id,
    ).first()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    article = db.query(Article).filter(Article.id == article_id).first()
    if article and article.save_count > 0:
        article.save_count -= 1

    db.delete(bookmark)
    db.commit()
    return {"message": "Removed bookmark"}
