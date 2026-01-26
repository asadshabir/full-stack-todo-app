"""
Authentication service for password hashing and JWT token management.
"""

import uuid
from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.config import get_settings
from src.models import User, UserCreate

settings = get_settings()

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: uuid.UUID) -> str:
    """
    Create a JWT access token for a user.

    Args:
        user_id: The user's UUID

    Returns:
        Encoded JWT token string
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access",
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> uuid.UUID | None:
    """
    Decode and validate a JWT access token.

    Args:
        token: The JWT token string

    Returns:
        User UUID if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
        user_id_str = payload.get("sub")
        if user_id_str is None:
            return None
        return uuid.UUID(user_id_str)
    except (JWTError, ValueError):
        return None


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    """Get a user by email address."""
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: uuid.UUID) -> User | None:
    """Get a user by ID."""
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    return result.scalar_one_or_none()


async def create_user(session: AsyncSession, user_data: UserCreate) -> User:
    """
    Create a new user account.

    Args:
        session: Database session
        user_data: User creation data (email, password)

    Returns:
        Created User object
    """
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email.lower().strip(),
        hashed_password=hashed_password,
    )
    session.add(user)
    await session.flush()
    await session.refresh(user)
    return user


async def authenticate_user(
    session: AsyncSession, email: str, password: str
) -> User | None:
    """
    Authenticate a user with email and password.

    Args:
        session: Database session
        email: User's email
        password: Plain text password

    Returns:
        User if authentication successful, None otherwise
    """
    user = await get_user_by_email(session, email.lower().strip())
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
