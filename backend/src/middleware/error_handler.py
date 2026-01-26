"""
Global error handling middleware.
Catches exceptions and returns user-friendly error messages.
"""

import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)


class AppException(Exception):
    """Base exception for application errors."""

    def __init__(
        self,
        message: str = "An error occurred",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "INTERNAL_ERROR",
    ):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(message)


class NotFoundError(AppException):
    """Resource not found."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND, "NOT_FOUND")


class UnauthorizedError(AppException):
    """Authentication required."""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED, "UNAUTHORIZED")


class ForbiddenError(AppException):
    """Access denied."""

    def __init__(self, message: str = "Access denied"):
        super().__init__(message, status.HTTP_403_FORBIDDEN, "FORBIDDEN")


class ValidationError(AppException):
    """Invalid input."""

    def __init__(self, message: str = "Invalid input"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, "VALIDATION_ERROR")


class AIServiceError(AppException):
    """AI service unavailable."""

    def __init__(self, message: str = "AI service temporarily unavailable"):
        super().__init__(message, status.HTTP_503_SERVICE_UNAVAILABLE, "AI_SERVICE_ERROR")


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handle application-specific exceptions."""
    logger.warning(
        f"AppException: {exc.code} - {exc.message}",
        extra={"path": request.url.path, "code": exc.code},
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "code": exc.code},
    )


async def sqlalchemy_exception_handler(
    request: Request, exc: SQLAlchemyError
) -> JSONResponse:
    """Handle database errors."""
    logger.error(
        f"Database error: {exc}",
        exc_info=True,
        extra={"path": request.url.path},
    )
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "Database operation failed. Please try again.",
            "code": "DATABASE_ERROR",
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected errors."""
    import traceback
    error_detail = str(exc)
    error_traceback = traceback.format_exc()
    logger.error(
        f"Unexpected error: {error_detail}\n{error_traceback}",
        extra={"path": request.url.path},
    )
    # In development, return more detail
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": error_detail or "Something went wrong. Please try again.",
            "code": "INTERNAL_ERROR",
            "detail": error_traceback,
        },
    )
