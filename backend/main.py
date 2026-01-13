from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import sys
from dotenv import load_dotenv

# Load environment variables FIRST before any other imports
load_dotenv()

# Verify DATABASE_URL is loaded
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    print(f"[STARTUP] DATABASE_URL loaded: {DATABASE_URL[:30]}...")
else:
    print("[ERROR] DATABASE_URL not found in environment")

# Import after dotenv is loaded
from utils.database import test_connection
from routes import auth_router, todos_router

# Global flag to track database status
_db_available = False
_db_error_message = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.

    Startup:
        - Test database connection (non-blocking)
        - Attempt to create tables if connection succeeds

    Shutdown:
        - Close database connections gracefully
    """
    global _db_available, _db_error_message

    # Startup
    print("[STARTUP] Starting TaskFlow 3D API...")

    # Test database connection without failing startup
    try:
        print("[STARTUP] Testing database connection...")
        success, error = test_connection()

        if success:
            _db_available = True
            print("[SUCCESS] Database connection verified")

            # Only create tables if connection works
            try:
                from utils.database import get_engine
                from sqlmodel import SQLModel
                engine = get_engine()
                # Drop existing tables and recreate them to ensure correct schema
                SQLModel.metadata.drop_all(engine)
                SQLModel.metadata.create_all(engine)
                print("[SUCCESS] Database tables recreated with correct schema")
            except Exception as table_error:
                print(f"[WARNING] Table creation error: {table_error}")
                _db_error_message = f"Table creation failed: {table_error}"
        else:
            _db_available = False
            _db_error_message = error
            print(f"[WARNING] Database connection failed: {error[:200]}")
            print("[WARNING] API starting without database - auth/todo endpoints unavailable")

    except Exception as e:
        _db_available = False
        _db_error_message = str(e)
        print(f"[WARNING] Database startup error: {str(e)[:200]}")
        print("[WARNING] API starting without database - auth/todo endpoints unavailable")

    print("[SUCCESS] TaskFlow 3D API started successfully")
    print(f"[INFO] Server listening on http://0.0.0.0:{os.getenv('PORT', '8000')}")
    print(f"[INFO] API Docs: http://localhost:{os.getenv('PORT', '8000')}/docs")
    print(f"[INFO] Database: {'CONNECTED' if _db_available else 'DISCONNECTED'}")

    yield

    # Shutdown
    print("[SHUTDOWN] Shutting down TaskFlow 3D API...")
    try:
        if _db_available:
            from utils.database import get_engine
            engine = get_engine()
            engine.dispose()
            print("[SUCCESS] Database connections closed")
    except Exception as e:
        print(f"[WARNING] Shutdown error: {e}")


# Create FastAPI application
app = FastAPI(
    title="TaskFlow 3D API",
    description="Backend API for TaskFlow 3D todo application with JWT authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(todos_router)


@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    """
    Root endpoint to verify API is running.

    Returns:
        dict: API status and version information
    """
    return {
        "message": "Welcome to TaskFlow 3D API",
        "version": "1.0.0",
        "status": "running",
        "database": "connected" if _db_available else "disconnected",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint for monitoring.

    Returns:
        dict: Service health status including database connectivity
    """
    if not _db_available:
        return {
            "status": "degraded",
            "database": "disconnected",
            "error": _db_error_message or "Database not available",
            "service": "TaskFlow 3D API",
            "note": "Server is running but database connection failed. Check DATABASE_URL in .env"
        }

    # Perform live database check
    success, error = test_connection()

    if success:
        return {
            "status": "healthy",
            "database": "connected",
            "service": "TaskFlow 3D API"
        }
    else:
        return {
            "status": "degraded",
            "database": "disconnected",
            "error": error[:200] if error else "Unknown error",
            "service": "TaskFlow 3D API"
        }


if __name__ == "__main__":
    import uvicorn

    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", "8000"))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )
