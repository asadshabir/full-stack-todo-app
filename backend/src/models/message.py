"""
Message model for conversation messages.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from src.models.conversation import Conversation


class MessageRole(str, Enum):
    """Role of the message sender."""

    USER = "user"
    ASSISTANT = "assistant"


class Message(SQLModel, table=True):
    """Individual message in a conversation."""

    __tablename__ = "messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", index=True)
    role: MessageRole = Field(default=MessageRole.USER)
    content: str = Field()
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: "Conversation" = Relationship(back_populates="messages")


class MessageCreate(SQLModel):
    """Schema for creating a message."""

    role: MessageRole
    content: str


class MessageResponse(SQLModel):
    """Schema for message response."""

    id: uuid.UUID
    role: MessageRole
    content: str
    created_at: datetime
