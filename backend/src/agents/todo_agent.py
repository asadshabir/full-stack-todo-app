"""
Todo Agent using Google Gemini for natural language task management.
"""

import uuid
from typing import Any

from google import genai
from google.genai import types
from sqlalchemy.ext.asyncio import AsyncSession

from src.agents.prompts import SYSTEM_PROMPT
from src.config import get_settings
from src.services import task_service

settings = get_settings()

# Configure Gemini client
client = genai.Client(api_key=settings.google_api_key)

# Define tools for function calling
TASK_TOOLS = [
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="create_task",
                description="Creates a new task for the user's todo list",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "title": types.Schema(
                            type=types.Type.STRING,
                            description="The title/description of the task to create",
                        ),
                    },
                    required=["title"],
                ),
            ),
            types.FunctionDeclaration(
                name="list_tasks",
                description="Lists the user's tasks with optional filtering",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "filter": types.Schema(
                            type=types.Type.STRING,
                            description="Filter: 'all', 'pending', or 'completed'",
                        ),
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="complete_task",
                description="Marks a task as completed by its ID",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "task_id": types.Schema(
                            type=types.Type.STRING,
                            description="The ID of the task to complete",
                        ),
                    },
                    required=["task_id"],
                ),
            ),
            types.FunctionDeclaration(
                name="delete_task",
                description="Deletes a task from the user's list by its ID",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "task_id": types.Schema(
                            type=types.Type.STRING,
                            description="The ID of the task to delete",
                        ),
                    },
                    required=["task_id"],
                ),
            ),
            types.FunctionDeclaration(
                name="update_task",
                description="Updates a task's title",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "task_id": types.Schema(
                            type=types.Type.STRING,
                            description="The ID of the task to update",
                        ),
                        "new_title": types.Schema(
                            type=types.Type.STRING,
                            description="The new title for the task",
                        ),
                    },
                    required=["task_id", "new_title"],
                ),
            ),
        ]
    )
]


async def execute_tool(
    session: AsyncSession,
    user_id: uuid.UUID,
    tool_name: str,
    tool_args: dict[str, Any],
) -> dict[str, Any]:
    """Execute a tool function and return the result."""
    try:
        if tool_name == "create_task":
            task = await task_service.create_task(
                session, user_id, tool_args.get("title", "")
            )
            return {
                "success": True,
                "task": {"id": str(task.id), "title": task.title},
            }

        elif tool_name == "list_tasks":
            filter_type = tool_args.get("filter", "all")
            tasks = await task_service.get_tasks(session, user_id, filter_type)
            return {
                "success": True,
                "tasks": [
                    {"id": str(t.id), "title": t.title, "completed": t.completed}
                    for t in tasks
                ],
                "count": len(tasks),
            }

        elif tool_name == "complete_task":
            task_id = uuid.UUID(tool_args.get("task_id", ""))
            task = await task_service.complete_task(session, user_id, task_id)
            if task:
                return {
                    "success": True,
                    "task": {"id": str(task.id), "title": task.title},
                }
            return {"success": False, "error": "Task not found"}

        elif tool_name == "delete_task":
            task_id = uuid.UUID(tool_args.get("task_id", ""))
            title = await task_service.delete_task(session, user_id, task_id)
            if title:
                return {"success": True, "deleted_title": title}
            return {"success": False, "error": "Task not found"}

        elif tool_name == "update_task":
            task_id = uuid.UUID(tool_args.get("task_id", ""))
            new_title = tool_args.get("new_title", "")
            task = await task_service.update_task(
                session, user_id, task_id, new_title=new_title
            )
            if task:
                return {
                    "success": True,
                    "task": {"id": str(task.id), "title": task.title},
                }
            return {"success": False, "error": "Task not found"}

        return {"success": False, "error": f"Unknown tool: {tool_name}"}

    except Exception as e:
        return {"success": False, "error": str(e)}


async def chat_with_agent(
    session: AsyncSession,
    user_id: uuid.UUID,
    user_message: str,
    conversation_history: list[dict] | None = None,
) -> str:
    """
    Process a user message and generate a response using Gemini.
    """
    # Build conversation history
    contents = []
    if conversation_history:
        for msg in conversation_history:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))

    # Add current user message
    contents.append(types.Content(role="user", parts=[types.Part(text=user_message)]))

    # Generate response with tools
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            tools=TASK_TOOLS,
        ),
    )

    # Handle function calls
    max_iterations = 5
    iteration = 0

    while iteration < max_iterations:
        # Check for function calls in response
        function_calls = []
        if response.candidates and response.candidates[0].content:
            for part in response.candidates[0].content.parts:
                if part.function_call:
                    function_calls.append(part.function_call)

        if not function_calls:
            break

        # Execute each function call
        function_responses = []
        for fc in function_calls:
            tool_name = fc.name
            tool_args = dict(fc.args) if fc.args else {}

            result = await execute_tool(session, user_id, tool_name, tool_args)

            function_responses.append(
                types.Part(
                    function_response=types.FunctionResponse(
                        name=tool_name,
                        response=result,
                    )
                )
            )

        # Add function results and continue conversation
        contents.append(response.candidates[0].content)
        contents.append(types.Content(role="user", parts=function_responses))

        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                tools=TASK_TOOLS,
            ),
        )
        iteration += 1

    # Extract final text response
    if response.candidates and response.candidates[0].content:
        for part in response.candidates[0].content.parts:
            if part.text:
                return part.text

    return "I'm sorry, I couldn't process that request. Please try again."
