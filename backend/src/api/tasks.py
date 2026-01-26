"""
Tasks API endpoints for direct task management.
These endpoints complement the chat-based interface.
"""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_session
from src.middleware.auth_middleware import CurrentUser
from src.middleware.error_handler import NotFoundError, ValidationError
from src.models import TaskCreate, TaskResponse, TaskUpdate
from src.services import task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


class TaskListResponse(BaseModel):
    """Response for task list."""

    tasks: list[TaskResponse]
    count: int


class TaskCreateRequest(BaseModel):
    """Request body for creating a task."""

    title: str


class TaskUpdateRequest(BaseModel):
    """Request body for updating a task."""

    title: str | None = None
    completed: bool | None = None


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
    filter: str = Query("all", pattern="^(all|pending|completed)$"),
) -> TaskListResponse:
    """
    List all tasks for the current user.

    - **filter**: Filter tasks by status (all, pending, completed)
    """
    tasks = await task_service.get_tasks(session, current_user.id, filter)
    return TaskListResponse(
        tasks=[
            TaskResponse(
                id=t.id,
                title=t.title,
                completed=t.completed,
                created_at=t.created_at,
                completed_at=t.completed_at,
            )
            for t in tasks
        ],
        count=len(tasks),
    )


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    request: TaskCreateRequest,
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TaskResponse:
    """Create a new task."""
    if not request.title or not request.title.strip():
        raise ValidationError("Task title cannot be empty")

    task = await task_service.create_task(session, current_user.id, request.title)
    return TaskResponse(
        id=task.id,
        title=task.title,
        completed=task.completed,
        created_at=task.created_at,
        completed_at=task.completed_at,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: uuid.UUID,
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TaskResponse:
    """Get a specific task by ID."""
    task = await task_service.get_task_by_id(session, current_user.id, task_id)
    if task is None:
        raise NotFoundError("Task not found")

    return TaskResponse(
        id=task.id,
        title=task.title,
        completed=task.completed,
        created_at=task.created_at,
        completed_at=task.completed_at,
    )


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: uuid.UUID,
    request: TaskUpdateRequest,
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TaskResponse:
    """Update a task's title or completion status."""
    task = await task_service.update_task(
        session,
        current_user.id,
        task_id,
        new_title=request.title,
        completed=request.completed,
    )
    if task is None:
        raise NotFoundError("Task not found")

    return TaskResponse(
        id=task.id,
        title=task.title,
        completed=task.completed,
        created_at=task.created_at,
        completed_at=task.completed_at,
    )


@router.delete("/{task_id}")
async def delete_task(
    task_id: uuid.UUID,
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> dict:
    """Delete a task."""
    title = await task_service.delete_task(session, current_user.id, task_id)
    if title is None:
        raise NotFoundError("Task not found")

    return {"message": f"Task '{title}' deleted successfully"}
