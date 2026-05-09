from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: str
    name: str | None
    level: str
    preferred_topics: list[str]

    model_config = {"from_attributes": True}


class OnboardingRequest(BaseModel):
    level: str
    preferred_topics: list[str]
