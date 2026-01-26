"""
Task model for todo items.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from src.models.user import User


class Task(SQLModel, table=True):
    """Todo task owned by a user."""

    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=500)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = Field(default=None)

    # Relationships
    user: "User" = Relationship(back_populates="tasks")


class TaskCreate(SQLModel):
    """Schema for creating a task."""

    title: str


class TaskUpdate(SQLModel):
    """Schema for updating a task."""

    title: str | None = None
    completed: bool | None = None


class TaskResponse(SQLModel):
    """Schema for task response."""

    id: uuid.UUID
    title: str
    completed: bool
    created_at: datetime
    completed_at: datetime | None = None
