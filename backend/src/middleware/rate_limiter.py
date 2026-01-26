"""
Rate limiting middleware.
Implements in-memory rate limiting per user/IP.
"""

import time
from collections import defaultdict
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware using sliding window algorithm.
    Limits requests per user/IP within a time window.
    """

    def __init__(self, app, requests_limit: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        # Store request timestamps per identifier
        self.request_counts: dict[str, list[float]] = defaultdict(list)

    def _get_identifier(self, request: Request) -> str:
        """Get unique identifier for rate limiting (user_id or IP)."""
        # Try to get user_id from request state (set by auth middleware)
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"user:{user_id}"

        # Fall back to IP address
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return f"ip:{forwarded.split(',')[0].strip()}"
        return f"ip:{request.client.host if request.client else 'unknown'}"

    def _cleanup_old_requests(self, identifier: str, current_time: float) -> None:
        """Remove request timestamps outside the current window."""
        cutoff = current_time - self.window_seconds
        self.request_counts[identifier] = [
            ts for ts in self.request_counts[identifier] if ts > cutoff
        ]

    def _is_rate_limited(self, identifier: str) -> bool:
        """Check if identifier has exceeded rate limit."""
        current_time = time.time()
        self._cleanup_old_requests(identifier, current_time)

        if len(self.request_counts[identifier]) >= self.requests_limit:
            return True

        self.request_counts[identifier].append(current_time)
        return False

    async def dispatch(self, request: Request, call_next):
        """Process request with rate limiting."""
        # Skip rate limiting for health checks
        if request.url.path == "/api/health":
            return await call_next(request)

        identifier = self._get_identifier(request)

        if self._is_rate_limited(identifier):
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Too many requests. Please slow down.",
                    "code": "RATE_LIMITED",
                },
                headers={
                    "Retry-After": str(self.window_seconds),
                },
            )

        response = await call_next(request)
        return response


def create_rate_limiter() -> RateLimitMiddleware:
    """Create rate limiter with settings from config."""
    from src.config import get_settings
    settings = get_settings()
    return RateLimitMiddleware(
        app=None,  # Will be set when adding to FastAPI
        requests_limit=settings.rate_limit_requests,
        window_seconds=settings.rate_limit_window,
    )
