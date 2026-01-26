"""
Authentication API endpoints.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_session
from src.middleware.auth_middleware import AUTH_COOKIE_NAME, CurrentUser
from src.middleware.error_handler import UnauthorizedError, ValidationError
from src.models import UserCreate, UserResponse
from src.services.auth_service import authenticate_user, create_access_token, create_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


class SignUpRequest(BaseModel):
    """Request body for signup."""

    email: EmailStr
    password: str


class SignInRequest(BaseModel):
    """Request body for signin."""

    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Response for successful authentication."""

    user: UserResponse
    access_token: str
    message: str


def set_auth_cookie(response: Response, token: str) -> None:
    """Set HTTP-only authentication cookie."""
    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24,  # 24 hours
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    """Clear authentication cookie."""
    response.delete_cookie(
        key=AUTH_COOKIE_NAME,
        path="/",
    )


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: SignUpRequest,
    response: Response,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> AuthResponse:
    """
    Create a new user account.

    Returns user info and sets authentication cookie.
    """
    # Validate password length
    if len(request.password) < 8:
        raise ValidationError("Password must be at least 8 characters")

    try:
        user = await create_user(
            session, UserCreate(email=request.email, password=request.password)
        )
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise ValidationError("Email already registered")

    # Create JWT token and set cookie
    token = create_access_token(user.id)
    set_auth_cookie(response, token)

    return AuthResponse(
        user=UserResponse(id=user.id, email=user.email),
        access_token=token,
        message="Account created successfully",
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(
    request: SignInRequest,
    response: Response,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> AuthResponse:
    """
    Authenticate user and create session.

    Returns user info and sets authentication cookie.
    """
    user = await authenticate_user(session, request.email, request.password)
    if user is None:
        raise UnauthorizedError("Invalid email or password")

    # Create JWT token and set cookie
    token = create_access_token(user.id)
    set_auth_cookie(response, token)

    return AuthResponse(
        user=UserResponse(id=user.id, email=user.email),
        access_token=token,
        message="Signed in successfully",
    )


@router.post("/signout")
async def signout(response: Response) -> dict:
    """
    Sign out current user by clearing authentication cookie.
    """
    clear_auth_cookie(response)
    return {"message": "Signed out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser) -> UserResponse:
    """
    Get current authenticated user's information.
    """
    return UserResponse(id=current_user.id, email=current_user.email)
