"""
FastAPI middleware exports.
"""

from src.middleware.error_handler import (
    AIServiceError,
    AppException,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
    app_exception_handler,
    generic_exception_handler,
    sqlalchemy_exception_handler,
)
from src.middleware.rate_limiter import RateLimitMiddleware

__all__ = [
    # Exceptions
    "AppException",
    "NotFoundError",
    "UnauthorizedError",
    "ForbiddenError",
    "ValidationError",
    "AIServiceError",
    # Handlers
    "app_exception_handler",
    "sqlalchemy_exception_handler",
    "generic_exception_handler",
    # Middleware
    "RateLimitMiddleware",
]
