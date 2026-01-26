"""
Application configuration using Pydantic Settings.
Loads environment variables with validation and type coercion.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str

    # Google Gemini Configuration
    google_api_key: str
    gemini_model: str = "gemini-2.0-flash"

    # JWT Configuration
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours

    # CORS Configuration
    cors_origins: str = "http://localhost:3000"

    # Rate Limiting
    rate_limit_requests: int = 60
    rate_limit_window: int = 60  # seconds

    # AI Context Configuration
    context_window_size: int = 20

    # Server Configuration
    port: int = 8000

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
