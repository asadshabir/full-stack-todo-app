# TaskFlow 3D Backend API

Production-ready FastAPI backend for the TaskFlow 3D todo application with JWT authentication, PostgreSQL database, and comprehensive user isolation.

## Features

- **JWT Authentication**: Secure token-based authentication with bcrypt password hashing
- **User Isolation**: Users can only access their own todos
- **PostgreSQL Database**: Neon PostgreSQL with SQLModel ORM
- **RESTful API**: Full CRUD operations for todos with filtering and sorting
- **Type Safety**: Complete type hints with Pydantic validation
- **CORS Enabled**: Configured for Next.js frontend
- **Auto Documentation**: Interactive API docs at `/docs` and `/redoc`

## Project Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── models/
│   ├── user.py            # User SQLModel
│   └── todo.py            # Todo SQLModel
├── schemas/
│   ├── user.py            # Pydantic request/response schemas
│   └── todo.py            # Pydantic request/response schemas
├── routes/
│   ├── auth.py            # Authentication endpoints
│   └── todos.py           # Todo CRUD endpoints
├── utils/
│   ├── auth.py            # JWT & password hashing utilities
│   └── database.py        # Database connection management
└── middleware/
    └── auth.py            # JWT verification middleware
```

## Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# - Add your Neon PostgreSQL connection string
# - Generate a secure JWT secret key
```

**Generate a secure JWT secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Run the Server

```bash
# Development mode with auto-reload
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/signin` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| POST | `/api/auth/signout` | Logout | Yes |

### Todos

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/todos` | Get user's todos (with filters) | Yes |
| POST | `/api/todos` | Create new todo | Yes |
| GET | `/api/todos/{id}` | Get single todo | Yes |
| PUT | `/api/todos/{id}` | Update todo | Yes |
| DELETE | `/api/todos/{id}` | Delete todo | Yes |
| PATCH | `/api/todos/{id}/toggle` | Toggle completion status | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API status | No |
| GET | `/health` | Health check with DB status | No |

## Usage Examples

### 1. Sign Up

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "name": "John Doe"
  }'
```

### 2. Sign In

```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

### 3. Create Todo (with token)

```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the TaskFlow 3D backend",
    "priority": "high",
    "category": "work",
    "status": "in-progress",
    "due_date": "2024-12-31"
  }'
```

### 4. Get Todos with Filters

```bash
# Get all high priority todos
curl http://localhost:8000/api/todos?priority=high \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get completed todos sorted by due date
curl http://localhost:8000/api/todos?completed=true&sort_by=due_date&sort_order=asc \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search todos
curl http://localhost:8000/api/todos?search=project \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Update Todo

```bash
curl -X PUT http://localhost:8000/api/todos/{todo_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated title",
    "status": "completed",
    "completed": true
  }'
```

### 6. Toggle Todo Completion

```bash
curl -X PATCH http://localhost:8000/api/todos/{todo_id}/toggle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"completed": true}'
```

## Todo Filters

The `GET /api/todos` endpoint supports the following query parameters:

- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by priority (low, medium, high)
- `category` (string): Filter by category (personal, work, shopping, health, other)
- `status` (string): Filter by status (pending, in-progress, completed)
- `search` (string): Search in title and description
- `sort_by` (string): Sort field (created_at, due_date, priority, title)
- `sort_order` (string): Sort direction (asc, desc)

## Database Models

### User Model

```python
{
  "id": "uuid",
  "email": "string (unique)",
  "password_hash": "string (bcrypt)",
  "name": "string (optional)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Todo Model

```python
{
  "id": "uuid",
  "user_id": "uuid (foreign key)",
  "title": "string (max 200 chars)",
  "description": "string (optional)",
  "completed": "boolean",
  "priority": "string (low|medium|high)",
  "category": "string",
  "status": "string (pending|in-progress|completed)",
  "due_date": "string (ISO format, optional)",
  "reminder_time": "datetime (optional)",
  "reminder_enabled": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Security Features

- **Password Hashing**: Bcrypt with automatic salt generation
- **JWT Tokens**: 24-hour expiration, signed with HS256
- **User Isolation**: All queries automatically filtered by user_id
- **Access Control**: Middleware verifies user ownership of resources
- **SQL Injection Prevention**: Parameterized queries via SQLModel
- **CORS Protection**: Configurable allowed origins

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | `your-secret-key-here` |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `JWT_EXPIRATION_HOURS` | Token expiration time | `24` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `PORT` | Server port | `8000` |

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **204**: No Content (delete success)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (access denied)
- **404**: Not Found (resource doesn't exist)
- **422**: Unprocessable Entity (semantic validation errors)
- **500**: Internal Server Error
- **503**: Service Unavailable (database connection error)

## Testing

```bash
# Test database connection
curl http://localhost:8000/health

# View interactive API documentation
# Open http://localhost:8000/docs in browser
```

## Production Deployment

### Pre-deployment Checklist

- [ ] Set strong JWT_SECRET_KEY (use `secrets.token_urlsafe(32)`)
- [ ] Use production PostgreSQL instance (Neon, AWS RDS, etc.)
- [ ] Set `CORS_ORIGINS` to production frontend URL
- [ ] Disable auto-reload in production
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure proper logging
- [ ] Set up monitoring and alerts
- [ ] Use environment variables manager (not .env file)

### Production Run Command

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Troubleshooting

### Database Connection Error

```
Error: DATABASE_URL environment variable is not set
```
**Solution**: Copy `.env.example` to `.env` and add your Neon connection string.

### JWT Secret Error

```
Error: JWT_SECRET_KEY environment variable is not set
```
**Solution**: Generate a secret key and add to `.env`:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Import Errors

```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution**: Install dependencies:
```bash
pip install -r requirements.txt
```

### CORS Errors in Frontend

```
Access to fetch at 'http://localhost:8000' has been blocked by CORS policy
```
**Solution**: Verify `CORS_ORIGINS` in `.env` includes your frontend URL.

## Development Tips

1. **Auto-reload**: The server automatically reloads on code changes when run with `python main.py`
2. **Interactive Docs**: Use `/docs` for testing endpoints without curl
3. **Type Safety**: All functions have type hints for better IDE support
4. **Logging**: Set `echo=True` in `database.py` to log SQL queries
5. **Database Schema**: Tables are automatically created on startup

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
