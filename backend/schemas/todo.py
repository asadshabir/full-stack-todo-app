from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class TodoCreate(BaseModel):
    """Schema for creating a new todo."""
    title: str = Field(..., min_length=1, max_length=200, description="Todo title")
    description: Optional[str] = Field(None, description="Detailed description")
    priority: str = Field(default="medium", pattern="^(low|medium|high)$", description="Priority level")
    category: str = Field(default="personal", description="Task category")
    status: str = Field(default="pending", pattern="^(pending|in-progress|completed)$", description="Task status")
    due_date: Optional[str] = Field(None, description="Due date in ISO format")
    reminder_time: Optional[datetime] = Field(None, description="Reminder timestamp")
    reminder_enabled: bool = Field(default=False, description="Whether reminder is active")


class TodoUpdate(BaseModel):
    """Schema for updating an existing todo."""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Todo title")
    description: Optional[str] = Field(None, description="Detailed description")
    completed: Optional[bool] = Field(None, description="Completion status")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$", description="Priority level")
    category: Optional[str] = Field(None, description="Task category")
    status: Optional[str] = Field(None, pattern="^(pending|in-progress|completed)$", description="Task status")
    due_date: Optional[str] = Field(None, description="Due date in ISO format")
    reminder_time: Optional[datetime] = Field(None, description="Reminder timestamp")
    reminder_enabled: Optional[bool] = Field(None, description="Whether reminder is active")


class TodoToggle(BaseModel):
    """Schema for toggling todo completion status."""
    completed: bool = Field(..., description="New completion status")


class TodoResponse(BaseModel):
    """Schema for todo data in responses."""
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    category: str
    status: str
    due_date: Optional[str]
    reminder_time: Optional[datetime]
    reminder_enabled: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
