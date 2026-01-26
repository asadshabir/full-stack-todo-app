"""
Authentication middleware for JWT token verification.
"""

import uuid
from typing import Annotated

from fastapi import Cookie, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_session
from src.middleware.error_handler import UnauthorizedError
from src.models import User
from src.services.auth_service import decode_access_token, get_user_by_id

# Cookie name for JWT token
AUTH_COOKIE_NAME = "access_token"


def extract_bearer_token(authorization: str | None) -> str | None:
    """Extract token from Authorization header (Bearer scheme)."""
    if authorization and authorization.startswith("Bearer "):
        return authorization[7:]
    return None


async def get_current_user(
    request: Request,
    session: Annotated[AsyncSession, Depends(get_session)],
    access_token: Annotated[str | None, Cookie(alias=AUTH_COOKIE_NAME)] = None,
    authorization: Annotated[str | None, Header()] = None,
) -> User:
    """
    Dependency to get the current authenticated user.

    Extracts JWT from HTTP-only cookie or Authorization header,
    validates it, and returns the user.
    Sets user_id on request.state for rate limiting.

    Priority: Authorization header > Cookie

    Raises:
        UnauthorizedError: If token is missing, invalid, or user not found
    """
    # Try Authorization header first, then fall back to cookie
    token = extract_bearer_token(authorization) or access_token

    if token is None:
        raise UnauthorizedError("Authentication required")

    user_id = decode_access_token(token)
    if user_id is None:
        raise UnauthorizedError("Invalid or expired token")

    user = await get_user_by_id(session, user_id)
    if user is None:
        raise UnauthorizedError("User not found")

    # Set user_id on request state for rate limiting
    request.state.user_id = str(user.id)

    return user


async def get_current_user_id(
    request: Request,
    access_token: Annotated[str | None, Cookie(alias=AUTH_COOKIE_NAME)] = None,
    authorization: Annotated[str | None, Header()] = None,
) -> uuid.UUID:
    """
    Lightweight dependency to get just the user ID without DB lookup.
    Useful for rate limiting or logging where full user object isn't needed.

    Priority: Authorization header > Cookie

    Raises:
        UnauthorizedError: If token is missing or invalid
    """
    # Try Authorization header first, then fall back to cookie
    token = extract_bearer_token(authorization) or access_token

    if token is None:
        raise UnauthorizedError("Authentication required")

    user_id = decode_access_token(token)
    if user_id is None:
        raise UnauthorizedError("Invalid or expired token")

    # Set user_id on request state for rate limiting
    request.state.user_id = str(user_id)

    return user_id


# Type alias for dependency injection
CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentUserId = Annotated[uuid.UUID, Depends(get_current_user_id)]
