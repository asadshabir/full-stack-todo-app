"""
Conversation service for managing chat sessions and messages.
"""

import uuid
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.config import get_settings
from src.models import Conversation, Message, MessageRole

settings = get_settings()


async def get_or_create_conversation(
    session: AsyncSession, user_id: uuid.UUID, conversation_id: uuid.UUID | None = None
) -> Conversation:
    """
    Get existing conversation or create a new one.

    Args:
        session: Database session
        user_id: Owner's user ID
        conversation_id: Optional existing conversation ID

    Returns:
        Conversation object
    """
    if conversation_id:
        statement = select(Conversation).where(
            Conversation.id == conversation_id, Conversation.user_id == user_id
        )
        result = await session.execute(statement)
        conversation = result.scalar_one_or_none()
        if conversation:
            return conversation

    # Create new conversation
    conversation = Conversation(user_id=user_id)
    session.add(conversation)
    await session.flush()
    await session.refresh(conversation)
    return conversation


async def add_message(
    session: AsyncSession,
    conversation_id: uuid.UUID,
    role: MessageRole,
    content: str,
) -> Message:
    """
    Add a message to a conversation.

    Args:
        session: Database session
        conversation_id: Conversation to add message to
        role: Message role (user or assistant)
        content: Message content

    Returns:
        Created Message object
    """
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
    )
    session.add(message)

    # Update conversation last activity
    statement = select(Conversation).where(Conversation.id == conversation_id)
    result = await session.execute(statement)
    conversation = result.scalar_one_or_none()
    if conversation:
        conversation.last_activity_at = datetime.utcnow()
        session.add(conversation)

    await session.flush()
    await session.refresh(message)
    return message


async def get_conversation_context(
    session: AsyncSession, conversation_id: uuid.UUID, limit: int | None = None
) -> list[Message]:
    """
    Get recent messages for AI context.

    Args:
        session: Database session
        conversation_id: Conversation to get messages from
        limit: Max messages to return (defaults to config)

    Returns:
        List of Message objects (oldest first)
    """
    if limit is None:
        limit = settings.context_window_size

    statement = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )
    result = await session.execute(statement)
    messages = list(result.scalars().all())
    # Reverse to get chronological order
    return list(reversed(messages))


async def get_user_conversations(
    session: AsyncSession, user_id: uuid.UUID, limit: int = 20
) -> list[Conversation]:
    """
    Get user's recent conversations.

    Args:
        session: Database session
        user_id: Owner's user ID
        limit: Max conversations to return

    Returns:
        List of Conversation objects (most recent first)
    """
    statement = (
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.last_activity_at.desc())
        .limit(limit)
    )
    result = await session.execute(statement)
    return list(result.scalars().all())


async def get_conversation_messages(
    session: AsyncSession,
    user_id: uuid.UUID,
    conversation_id: uuid.UUID,
    limit: int = 100,
    offset: int = 0,
) -> list[Message]:
    """
    Get messages for a specific conversation (with pagination).

    Args:
        session: Database session
        user_id: Owner's user ID (for verification)
        conversation_id: Conversation to get messages from
        limit: Max messages to return
        offset: Number of messages to skip

    Returns:
        List of Message objects (chronological order)
    """
    # Verify conversation belongs to user
    conv_statement = select(Conversation).where(
        Conversation.id == conversation_id, Conversation.user_id == user_id
    )
    result = await session.execute(conv_statement)
    if result.scalar_one_or_none() is None:
        return []

    statement = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .offset(offset)
        .limit(limit)
    )
    result = await session.execute(statement)
    return list(result.scalars().all())
