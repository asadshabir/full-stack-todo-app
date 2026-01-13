from sqlmodel import create_engine, Session, SQLModel
from typing import Generator, Optional
import os
from dotenv import load_dotenv
import sqlalchemy

load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Global engine instance
_engine: Optional[object] = None
_connection_error: Optional[Exception] = None


def get_engine():
    """
    Get the database engine instance with lazy initialization.

    Returns:
        Engine: SQLModel engine instance

    Raises:
        ValueError: If DATABASE_URL is not set
        Exception: If database connection fails
    """
    global _engine, _connection_error

    if _engine is None:
        try:
            _engine = create_engine(
                DATABASE_URL,
                echo=False,  # Set to True for SQL query logging during development
                pool_size=5,
                max_overflow=10,
                pool_pre_ping=True,  # Verify connections before using them
                pool_recycle=3600,  # Recycle connections after 1 hour
                connect_args={"connect_timeout": 5}  # 5 second connection timeout
            )
            print(f"[DATABASE] Engine created for: {DATABASE_URL[:40]}...")
        except Exception as e:
            _connection_error = e
            print(f"[DATABASE ERROR] Failed to create engine: {e}")
            raise

    return _engine


def get_session() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.

    Yields:
        Session: SQLModel session for database operations

    Usage:
        @router.get("/endpoint")
        def handler(session: Session = Depends(get_session)):
            # Use session here
    """
    engine = get_engine()
    with Session(engine) as session:
        yield session


def create_db_tables() -> None:
    """
    Create all database tables defined in SQLModel models.

    This should be called on application startup to ensure
    all tables exist in the database.

    Raises:
        Exception: If table creation fails
    """
    try:
        # Import models to register them with SQLModel
        from models import User, Todo  # noqa: F401

        engine = get_engine()
        SQLModel.metadata.create_all(engine)
        print("[DATABASE] Tables created successfully")
    except Exception as e:
        print(f"[DATABASE ERROR] Failed to create tables: {e}")
        raise


def test_connection() -> tuple[bool, Optional[str]]:
    """
    Test database connection with timeout.

    Returns:
        tuple: (success: bool, error_message: Optional[str])
    """
    try:
        # Create a temporary engine with short timeout just for testing
        test_engine = create_engine(
            DATABASE_URL,
            echo=False,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 5}  # 5 second timeout
        )

        # Try to connect
        with test_engine.connect() as conn:
            result = conn.execute(sqlalchemy.text("SELECT 1"))
            result.fetchone()

        # If successful, cache this engine as the main engine
        global _engine
        _engine = test_engine

        return True, None

    except sqlalchemy.exc.OperationalError as e:
        error_msg = str(e)
        # Shorten long error messages
        if len(error_msg) > 300:
            error_msg = error_msg[:300] + "... (truncated)"
        return False, f"Database connection failed: {error_msg}"
    except Exception as e:
        return False, f"Unexpected error: {str(e)[:200]}"
