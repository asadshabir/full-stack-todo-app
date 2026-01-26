---
title: Todo AI Chatbot API
emoji: 🤖
colorFrom: purple
colorTo: pink
sdk: docker
pinned: false
license: mit
---

# Todo AI Chatbot API

AI-powered todo management through natural language conversation.

## Features
- JWT Authentication (signup, signin, signout)
- AI Chatbot powered by Google Gemini
- Task management via natural language
- Conversation history

## API Endpoints
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user
- `POST /api/chat` - Chat with AI
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/conversations` - List conversations

## Environment Variables Required
- `DATABASE_URL` - Neon PostgreSQL connection string
- `GOOGLE_API_KEY` - Google Gemini API key
- `JWT_SECRET` - Secret for JWT tokens
