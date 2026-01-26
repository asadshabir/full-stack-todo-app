"""
Chat API endpoint for conversational task management.
"""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_session
from src.middleware.auth_middleware import CurrentUser
from src.middleware.error_handler import ValidationError
from src.services.agent_service import invoke_agent

router = APIRouter(tags=["Chat"])


class ChatRequest(BaseModel):
    """Request body for chat endpoint."""

    message: str
    conversation_id: uuid.UUID | None = None


class ChatResponse(BaseModel):
    """Response from chat endpoint."""

    response: str
    conversation_id: uuid.UUID


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> ChatResponse:
    """
    Send a message to the Todo AI assistant.

    The assistant can help you:
    - Add tasks: "Add buy groceries to my list"
    - View tasks: "What's on my todo list?"
    - Complete tasks: "I finished buying groceries"
    - Delete tasks: "Remove buy groceries from my list"
    - Update tasks: "Change buy groceries to buy organic groceries"

    Returns the assistant's response and the conversation ID for continuity.
    """
    # Validate message
    message = request.message.strip()
    if not message:
        raise ValidationError("Message cannot be empty")

    if len(message) > 10000:
        raise ValidationError("Message too long (max 10,000 characters)")

    # Invoke agent
    response, conversation_id = await invoke_agent(
        session=session,
        user_id=current_user.id,
        user_message=message,
        conversation_id=request.conversation_id,
    )

    return ChatResponse(response=response, conversation_id=conversation_id)
