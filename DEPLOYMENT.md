# Deployment Guide

Complete step-by-step guide to deploy your Full-Stack Todo App to production.

## Prerequisites

- GitHub account with the repository: https://github.com/asadshabir/full-stack-todo-app
- Railway account (for backend): https://railway.app/
- Vercel account (for frontend): https://vercel.com/
- Neon database (already configured)

## Step 1: Deploy Backend to Railway

### 1.1 Sign Up / Login to Railway
1. Go to https://railway.app/
2. Sign in with GitHub

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `asadshabir/full-stack-todo-app`
4. Railway will detect your repository

### 1.3 Configure Backend Service
1. After project creation, click "Add Service" → "GitHub Repo"
2. Select your repository again
3. Click on the service settings (gear icon)
4. Configure:
   - **Name**: `todo-backend`
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 1.4 Add Environment Variables
Click on "Variables" tab and add:

```
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:3000
```

**To generate a secure JWT_SECRET:**
```bash
openssl rand -hex 32
```

Or use Python:
```python
import secrets
print(secrets.token_hex(32))
```

### 1.5 Deploy Backend
1. Click "Deploy"
2. Wait for deployment to complete (usually 2-3 minutes)
3. Railway will provide a URL like: `https://todo-backend-production-xxxx.up.railway.app`
4. **Copy this URL** - you'll need it for the frontend

### 1.6 Verify Backend Deployment
Visit your Railway URL with `/docs` to see the API documentation:
- `https://your-backend-url.railway.app/docs`

You should see the Swagger UI with all API endpoints.

## Step 2: Deploy Frontend to Vercel

### 2.1 Sign Up / Login to Vercel
1. Go to https://vercel.com/
2. Sign in with GitHub

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Click "Import" next to `asadshabir/full-stack-todo-app`

### 2.3 Configure Frontend Build
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Click "Edit" and select `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### 2.4 Add Environment Variables
Click "Environment Variables" and add:

**Variable Name**: `NEXT_PUBLIC_API_URL`
**Value**: Your Railway backend URL (e.g., `https://todo-backend-production-xxxx.up.railway.app`)

Make sure to add it for all environments: Production, Preview, and Development.

### 2.5 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete (usually 3-5 minutes)
3. Vercel will provide a URL like: `https://full-stack-todo-app-xxxx.vercel.app`

### 2.6 Test Your Deployment
1. Visit your Vercel URL
2. You should see the landing page
3. Try to sign up and create a new account
4. After signup, you should be redirected to the dashboard

## Step 3: Update Backend CORS

Now that you have your Vercel URL, update the backend's CORS configuration:

1. Go back to Railway
2. Go to your backend service
3. Click "Variables"
4. Update `CORS_ORIGINS` to include your Vercel URL:

```
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

5. Click "Add" or "Update"
6. Railway will automatically redeploy with the new environment variable

## Step 4: Final Testing

Test the complete flow:

1. **Landing Page**: Visit your Vercel URL
2. **Sign Up**: Create a new account
3. **Authentication**: Verify you're redirected to dashboard
4. **Create Todo**: Add a new todo item
5. **Edit Todo**: Update the todo
6. **Toggle Todo**: Mark as complete/incomplete
7. **Delete Todo**: Remove the todo
8. **Sign Out**: Log out
9. **Sign In**: Log back in with your credentials

## Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- **Solution**: Check Railway logs for errors
- Verify `DATABASE_URL` is correct
- Ensure all environment variables are set

**Problem**: CORS errors in browser console
- **Solution**: Verify `CORS_ORIGINS` includes your Vercel URL
- Make sure there are no trailing slashes in URLs

**Problem**: 401 Unauthorized errors
- **Solution**: Check that cookies are being set
- Verify `JWT_SECRET` is configured
- Check that frontend is sending credentials

### Frontend Issues

**Problem**: "Network Error" or cannot connect to backend
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check Railway backend is running
- Test backend URL directly: `https://your-backend.railway.app/health`

**Problem**: Environment variables not updating
- **Solution**: Redeploy on Vercel after changing env vars
- Go to Vercel → Deployments → Three dots → Redeploy

**Problem**: 404 errors on page refresh
- **Solution**: This is handled automatically by Next.js/Vercel
- If still occurring, check Vercel deployment logs

## Production Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured on both platforms
- [ ] CORS updated with Vercel URL
- [ ] Backend `/health` endpoint accessible
- [ ] Frontend landing page loads
- [ ] Sign up creates new user
- [ ] Sign in authenticates user
- [ ] Dashboard accessible after auth
- [ ] Todo CRUD operations work
- [ ] Sign out clears authentication
- [ ] Dark mode toggles properly

## URLs to Save

**GitHub Repository**: https://github.com/asadshabir/full-stack-todo-app

**Railway Backend**: `https://your-backend-url.railway.app`
- API Docs: `https://your-backend-url.railway.app/docs`
- Health Check: `https://your-backend-url.railway.app/health`

**Vercel Frontend**: `https://your-vercel-app.vercel.app`

## Next Steps

1. Add custom domain (optional)
2. Set up monitoring with Railway
3. Enable Vercel Analytics
4. Add Sentry for error tracking
5. Configure automated backups for database

## Support

If you encounter issues:
1. Check Railway logs: Railway Dashboard → Your Service → Logs
2. Check Vercel logs: Vercel Dashboard → Your Project → Deployments → View Logs
3. Test API endpoints directly using `/docs` on Railway URL
4. Verify environment variables in both Railway and Vercel

---

**Happy Deploying! 🚀**
