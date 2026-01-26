"""
Task service for CRUD operations on tasks.
All operations are scoped to the authenticated user.
"""

import uuid
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.models import Task, TaskCreate


async def create_task(
    session: AsyncSession, user_id: uuid.UUID, title: str
) -> Task:
    """
    Create a new task for a user.

    Args:
        session: Database session
        user_id: Owner's user ID
        title: Task title (max 500 chars)

    Returns:
        Created Task object
    """
    # Truncate title if too long
    title = title.strip()[:500]

    task = Task(
        user_id=user_id,
        title=title,
        completed=False,
    )
    session.add(task)
    await session.flush()
    await session.refresh(task)
    return task


async def get_tasks(
    session: AsyncSession,
    user_id: uuid.UUID,
    filter_type: str = "all",
) -> list[Task]:
    """
    Get tasks for a user with optional filtering.

    Args:
        session: Database session
        user_id: Owner's user ID
        filter_type: "all", "pending", or "completed"

    Returns:
        List of Task objects
    """
    statement = select(Task).where(Task.user_id == user_id)

    if filter_type == "pending":
        statement = statement.where(Task.completed == False)
    elif filter_type == "completed":
        statement = statement.where(Task.completed == True)

    statement = statement.order_by(Task.created_at.desc())
    result = await session.execute(statement)
    return list(result.scalars().all())


async def get_task_by_id(
    session: AsyncSession, user_id: uuid.UUID, task_id: uuid.UUID
) -> Task | None:
    """Get a specific task by ID (user-scoped)."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    return result.scalar_one_or_none()


async def find_task_by_term(
    session: AsyncSession, user_id: uuid.UUID, search_term: str
) -> list[Task]:
    """
    Find tasks matching a search term (case-insensitive).

    Args:
        session: Database session
        user_id: Owner's user ID
        search_term: Text to search in task titles

    Returns:
        List of matching Task objects
    """
    statement = (
        select(Task)
        .where(Task.user_id == user_id)
        .where(Task.title.ilike(f"%{search_term}%"))
        .order_by(Task.created_at.desc())
    )
    result = await session.execute(statement)
    return list(result.scalars().all())


async def complete_task(
    session: AsyncSession, user_id: uuid.UUID, task_id: uuid.UUID
) -> Task | None:
    """
    Mark a task as completed.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_id: Task to complete

    Returns:
        Updated Task or None if not found
    """
    task = await get_task_by_id(session, user_id, task_id)
    if task is None:
        return None

    task.completed = True
    task.completed_at = datetime.utcnow()
    session.add(task)
    await session.flush()
    await session.refresh(task)
    return task


async def delete_task(
    session: AsyncSession, user_id: uuid.UUID, task_id: uuid.UUID
) -> str | None:
    """
    Delete a task.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_id: Task to delete

    Returns:
        Deleted task title or None if not found
    """
    task = await get_task_by_id(session, user_id, task_id)
    if task is None:
        return None

    title = task.title
    await session.delete(task)
    await session.flush()
    return title


async def update_task(
    session: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    new_title: str | None = None,
    completed: bool | None = None,
) -> Task | None:
    """
    Update a task's title or completion status.

    Args:
        session: Database session
        user_id: Owner's user ID
        task_id: Task to update
        new_title: New title (optional)
        completed: New completion status (optional)

    Returns:
        Updated Task or None if not found
    """
    task = await get_task_by_id(session, user_id, task_id)
    if task is None:
        return None

    if new_title is not None:
        task.title = new_title.strip()[:500]

    if completed is not None:
        task.completed = completed
        if completed:
            task.completed_at = datetime.utcnow()
        else:
            task.completed_at = None

    session.add(task)
    await session.flush()
    await session.refresh(task)
    return task
