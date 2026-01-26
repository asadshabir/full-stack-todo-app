"""
FastAPI route handlers.
"""

from src.api.auth import router as auth_router
from src.api.chat import router as chat_router
from src.api.conversations import router as conversations_router
from src.api.health import router as health_router
from src.api.tasks import router as tasks_router

__all__ = [
    "auth_router",
    "chat_router",
    "conversations_router",
    "health_router",
    "tasks_router",
]
