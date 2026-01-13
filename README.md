# Full-Stack Todo App

A modern, full-stack todo application built with Next.js 15, FastAPI, PostgreSQL, and JWT authentication.

![GitHub repo](https://github.com/asadshabir/full-stack-todo-app)

## 🚀 Features

- ✅ **User Authentication**: Secure JWT-based authentication with HTTP-only cookies
- 📝 **Todo Management**: Create, read, update, delete, and toggle todos
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and shadcn/ui
- 🌙 **Dark Mode**: Full dark mode support
- 🔒 **Multi-user Support**: Complete data isolation between users
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Fast**: Optimized with Next.js 15 App Router and FastAPI

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.9 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + Hooks
- **Form Validation**: Zod
- **HTTP Client**: Fetch API with credentials

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ORM**: SQLModel
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Pydantic

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL database (or Neon account)
- Git

## 🏃 Quick Start (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/asadshabir/full-stack-todo-app.git
cd full-stack-todo-app
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your database URL and JWT secret
# DATABASE_URL=postgresql+psycopg://...
# JWT_SECRET=your-secret-key-here

# Run the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be running at http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

Frontend will be running at http://localhost:3000

## 🌐 Deployment

### Deploy Backend to Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Random secure string (generate with `openssl rand -hex 32`)
   - `JWT_ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440` (24 hours)
   - `CORS_ORIGINS`: `https://your-vercel-app.vercel.app`
6. Deploy!

Railway will provide a URL like: `https://your-app.railway.app`

### Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click "Import Project" → "Import Git Repository"
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL (e.g., `https://your-app.railway.app`)
6. Deploy!

Vercel will provide a URL like: `https://your-app.vercel.app`

### Update CORS

After deploying frontend, update your backend's `CORS_ORIGINS` environment variable in Railway to include your Vercel URL.

## 📝 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql+psycopg://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
# For production, use your Railway backend URL
# NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

## 🧪 Testing

### Backend API Testing

```bash
cd backend
python test_api.py
```

### Frontend Testing

Navigate to:
- http://localhost:3000 - Landing page
- http://localhost:3000/signup - Sign up page
- http://localhost:3000/signin - Sign in page
- http://localhost:3000/dashboard - Dashboard (requires auth)

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Authenticate user and get JWT token
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/signout` - Clear authentication cookie

#### Todos
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a todo
- `PATCH /api/todos/{id}/toggle` - Toggle todo completion status
- `DELETE /api/todos/{id}` - Delete a todo

## 🔐 Security Features

- JWT tokens stored in HTTP-only cookies (XSS protection)
- CORS configuration for cross-origin requests
- Password hashing with bcrypt
- SQL injection protection with SQLModel/SQLAlchemy
- Environment variable management for secrets
- User-specific data isolation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Asad Shabir**
- GitHub: [@asadshabir](https://github.com/asadshabir)

## 🙏 Acknowledgments

- Built with ❤️ for Hackathon Phase 2
- Assisted by Claude Sonnet 4.5

---

**Live Demo**: [Add your Vercel URL here after deployment]
**Backend API**: [Add your Railway URL here after deployment]
