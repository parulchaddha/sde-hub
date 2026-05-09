from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserResponse, OnboardingRequest
from app.services.auth_service import (
    create_user, get_user_by_email, verify_password, create_access_token,
)
from app.services.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    if get_user_by_email(db, body.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, body.email, body.password, body.name)
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/onboarding", response_model=UserResponse)
def onboarding(
    body: OnboardingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.level not in ("SDE-1", "SDE-2", "SDE-3"):
        raise HTTPException(status_code=400, detail="level must be SDE-1, SDE-2, or SDE-3")
    current_user.level = body.level
    current_user.preferred_topics = body.preferred_topics
    db.commit()
    db.refresh(current_user)
    return current_user
