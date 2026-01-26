"""
User model for authentication and identity.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from src.models.conversation import Conversation
    from src.models.task import Task


class User(SQLModel, table=True):
    """User account for authentication."""

    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user")
    conversations: list["Conversation"] = Relationship(back_populates="user")


class UserCreate(SQLModel):
    """Schema for creating a user."""

    email: str
    password: str


class UserResponse(SQLModel):
    """Schema for user response (no password)."""

    id: uuid.UUID
    email: str
