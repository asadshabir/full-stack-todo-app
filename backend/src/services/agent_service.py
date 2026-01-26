"""
Agent service for invoking the Todo AI agent.
Handles context loading and response generation.
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from src.agents.todo_agent import chat_with_agent
from src.models import MessageRole
from src.services.conversation_service import (
    add_message,
    get_conversation_context,
    get_or_create_conversation,
)


async def invoke_agent(
    session: AsyncSession,
    user_id: uuid.UUID,
    user_message: str,
    conversation_id: uuid.UUID | None = None,
) -> tuple[str, uuid.UUID]:
    """
    Invoke the Todo AI agent with a user message.

    This function:
    1. Gets or creates a conversation
    2. Loads conversation context
    3. Saves the user message
    4. Invokes the AI agent
    5. Saves the assistant response
    6. Returns the response and conversation ID

    Args:
        session: Database session
        user_id: Current user's ID
        user_message: The user's message
        conversation_id: Optional existing conversation ID

    Returns:
        Tuple of (assistant_response, conversation_id)
    """
    # Get or create conversation
    conversation = await get_or_create_conversation(
        session, user_id, conversation_id
    )

    # Load conversation context (previous messages)
    context_messages = await get_conversation_context(session, conversation.id)

    # Convert to format for agent
    conversation_history = [
        {"role": msg.role.value, "content": msg.content}
        for msg in context_messages
    ]

    # Save user message
    await add_message(session, conversation.id, MessageRole.USER, user_message)

    # Invoke AI agent
    try:
        response = await chat_with_agent(
            session=session,
            user_id=user_id,
            user_message=user_message,
            conversation_history=conversation_history,
        )
    except Exception as e:
        # Graceful error handling
        response = (
            "I'm having trouble processing your request right now. "
            "Please try again in a moment."
        )
        # Log the error (in production, use proper logging)
        print(f"Agent error: {e}")

    # Save assistant response
    await add_message(session, conversation.id, MessageRole.ASSISTANT, response)

    return response, conversation.id
