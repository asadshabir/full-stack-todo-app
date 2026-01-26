"""
Async database connection and session management.
Supports both PostgreSQL (Neon) and SQLite for local development.
"""

import ssl
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from src.config import get_settings

settings = get_settings()


def get_database_url() -> str:
    """
    Process database URL for compatibility with asyncpg.
    Removes query parameters that asyncpg doesn't support.
    """
    url = settings.database_url
    # Remove query parameters for asyncpg (sslmode, channel_binding, etc.)
    if "?" in url:
        url = url.split("?")[0]
    return url


def create_engine():
    """Create async engine based on database type."""
    url = get_database_url()

    # SQLite configuration
    if url.startswith("sqlite"):
        return create_async_engine(
            url,
            echo=False,
            connect_args={"check_same_thread": False},
        )

    # PostgreSQL configuration (with SSL for Neon)
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    return create_async_engine(
        url,
        echo=False,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        connect_args={"ssl": ssl_context},
    )


# Create async engine
engine = create_engine()

# Async session factory
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides an async database session.
    Automatically handles commit/rollback and closing.
    """
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    Initialize database tables.
    Creates all tables defined in SQLModel metadata.
    """
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """Close database connections."""
    await engine.dispose()
