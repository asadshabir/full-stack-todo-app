"""
Conversations API endpoints for chat history management.
"""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_session
from src.middleware.auth_middleware import CurrentUser
from src.middleware.error_handler import NotFoundError
from src.models import ConversationResponse, MessageResponse
from src.services.conversation_service import (
    get_conversation_messages,
    get_user_conversations,
)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


class ConversationListResponse(BaseModel):
    """Response for conversation list."""

    conversations: list[ConversationResponse]
    count: int


class MessageListResponse(BaseModel):
    """Response for message list."""

    messages: list[MessageResponse]
    count: int


@router.get("", response_model=ConversationListResponse)
async def list_conversations(
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: int = Query(20, ge=1, le=100),
) -> ConversationListResponse:
    """
    List all conversations for the current user.

    Returns conversations ordered by most recent activity.
    """
    conversations = await get_user_conversations(session, current_user.id, limit)
    return ConversationListResponse(
        conversations=[
            ConversationResponse(
                id=c.id,
                created_at=c.created_at,
                last_activity_at=c.last_activity_at,
            )
            for c in conversations
        ],
        count=len(conversations),
    )


@router.get("/{conversation_id}/messages", response_model=MessageListResponse)
async def get_messages(
    conversation_id: uuid.UUID,
    current_user: CurrentUser,
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
) -> MessageListResponse:
    """
    Get messages for a specific conversation.

    Returns messages in chronological order (oldest first).
    """
    messages = await get_conversation_messages(
        session, current_user.id, conversation_id, limit, offset
    )

    if not messages and offset == 0:
        # Check if conversation exists
        conversations = await get_user_conversations(session, current_user.id, limit=100)
        if not any(c.id == conversation_id for c in conversations):
            raise NotFoundError("Conversation not found")

    return MessageListResponse(
        messages=[
            MessageResponse(
                id=m.id,
                role=m.role,
                content=m.content,
                created_at=m.created_at,
            )
            for m in messages
        ],
        count=len(messages),
    )
