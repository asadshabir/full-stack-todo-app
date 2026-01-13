from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class Todo(SQLModel, table=True):
    """
    Todo model representing user tasks.

    Attributes:
        id: Unique todo identifier (UUID)
        user_id: Foreign key to users table
        title: Todo title/summary
        description: Optional detailed description
        completed: Completion status flag
        priority: Priority level (low, medium, high)
        category: Task category (personal, work, shopping, health, other)
        status: Current status (pending, in-progress, completed)
        due_date: Optional due date (ISO format string)
        reminder_time: Optional reminder timestamp
        reminder_enabled: Whether reminder is active
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """
    __tablename__ = "todos"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium", max_length=20)  # low, medium, high
    category: str = Field(default="personal", max_length=50)  # personal, work, shopping, health, other
    status: str = Field(default="pending", max_length=20)  # pending, in-progress, completed
    due_date: Optional[str] = Field(default=None, max_length=50)  # ISO format date string
    reminder_time: Optional[datetime] = Field(default=None)
    reminder_enabled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
