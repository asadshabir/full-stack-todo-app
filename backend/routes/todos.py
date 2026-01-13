from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, col
from typing import List, Optional
from datetime import datetime
import uuid

from utils.database import get_session
from models.user import User
from models.todo import Todo
from schemas.todo import TodoCreate, TodoUpdate, TodoResponse, TodoToggle
from middleware.auth import get_current_user, verify_user_access

router = APIRouter(prefix="/api/todos", tags=["Todos"])


@router.get("", response_model=List[TodoResponse])
async def get_todos(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    priority: Optional[str] = Query(None, description="Filter by priority (low, medium, high)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (pending, in-progress, completed)"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    sort_by: Optional[str] = Query("created_at", description="Sort field (created_at, due_date, priority, title)"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc, desc)"),
):
    """
    Get all todos for the current user with optional filtering and sorting.

    Args:
        session: Database session
        current_user: Current authenticated user
        completed: Filter by completion status (true/false)
        priority: Filter by priority level
        category: Filter by category
        status_filter: Filter by task status
        search: Search query for title/description
        sort_by: Field to sort by
        sort_order: Sort direction (asc/desc)

    Returns:
        List[TodoResponse]: List of user's todos matching filters
    """
    # Base query - only current user's todos
    statement = select(Todo).where(Todo.user_id == current_user.id)

    # Apply filters
    if completed is not None:
        statement = statement.where(Todo.completed == completed)

    if priority:
        statement = statement.where(Todo.priority == priority)

    if category:
        statement = statement.where(Todo.category == category)

    if status_filter:
        statement = statement.where(Todo.status == status_filter)

    if search:
        search_pattern = f"%{search}%"
        statement = statement.where(
            (col(Todo.title).contains(search)) |
            (col(Todo.description).contains(search))
        )

    # Apply sorting
    sort_column = getattr(Todo, sort_by, Todo.created_at)
    if sort_order.lower() == "asc":
        statement = statement.order_by(sort_column.asc())
    else:
        statement = statement.order_by(sort_column.desc())

    # Execute query
    todos = session.exec(statement).all()

    return [TodoResponse.model_validate(todo) for todo in todos]


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new todo for the current user.

    Args:
        todo_data: Todo creation data
        session: Database session
        current_user: Current authenticated user

    Returns:
        TodoResponse: Created todo object
    """
    # Create new todo
    new_todo = Todo(
        user_id=current_user.id,
        title=todo_data.title,
        description=todo_data.description,
        priority=todo_data.priority,
        category=todo_data.category,
        status=todo_data.status,
        due_date=todo_data.due_date,
        reminder_time=todo_data.reminder_time,
        reminder_enabled=todo_data.reminder_enabled,
    )

    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)

    return TodoResponse.model_validate(new_todo)


@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Get a specific todo by ID.

    Args:
        todo_id: Todo UUID
        session: Database session
        current_user: Current authenticated user

    Returns:
        TodoResponse: Todo object

    Raises:
        HTTPException: 404 if todo not found, 403 if access denied
    """
    # Fetch todo
    statement = select(Todo).where(Todo.id == todo_id)
    todo = session.exec(statement).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )

    # Verify user access
    verify_user_access(todo.user_id, current_user)

    return TodoResponse.model_validate(todo)


@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: uuid.UUID,
    todo_data: TodoUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Update a specific todo.

    Args:
        todo_id: Todo UUID
        todo_data: Todo update data (only provided fields will be updated)
        session: Database session
        current_user: Current authenticated user

    Returns:
        TodoResponse: Updated todo object

    Raises:
        HTTPException: 404 if todo not found, 403 if access denied
    """
    # Fetch todo
    statement = select(Todo).where(Todo.id == todo_id)
    todo = session.exec(statement).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )

    # Verify user access
    verify_user_access(todo.user_id, current_user)

    # Update fields (only those provided)
    update_data = todo_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)

    # Update timestamp
    todo.updated_at = datetime.utcnow()

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return TodoResponse.model_validate(todo)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a specific todo (permanent deletion).

    Args:
        todo_id: Todo UUID
        session: Database session
        current_user: Current authenticated user

    Raises:
        HTTPException: 404 if todo not found, 403 if access denied
    """
    # Fetch todo
    statement = select(Todo).where(Todo.id == todo_id)
    todo = session.exec(statement).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )

    # Verify user access
    verify_user_access(todo.user_id, current_user)

    # Delete todo
    session.delete(todo)
    session.commit()


@router.patch("/{todo_id}/toggle", response_model=TodoResponse)
async def toggle_todo_completion(
    todo_id: uuid.UUID,
    toggle_data: TodoToggle,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Toggle the completion status of a todo.

    Args:
        todo_id: Todo UUID
        toggle_data: Completion status to set
        session: Database session
        current_user: Current authenticated user

    Returns:
        TodoResponse: Updated todo object

    Raises:
        HTTPException: 404 if todo not found, 403 if access denied
    """
    # Fetch todo
    statement = select(Todo).where(Todo.id == todo_id)
    todo = session.exec(statement).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )

    # Verify user access
    verify_user_access(todo.user_id, current_user)

    # Toggle completion
    todo.completed = toggle_data.completed

    # Auto-update status based on completion
    if toggle_data.completed:
        todo.status = "completed"
    else:
        # If uncompleting, set back to in-progress if it was completed
        if todo.status == "completed":
            todo.status = "in-progress"

    # Update timestamp
    todo.updated_at = datetime.utcnow()

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return TodoResponse.model_validate(todo)
