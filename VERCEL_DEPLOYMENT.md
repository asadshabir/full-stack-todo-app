# Vercel Deployment Guide - Step by Step

Complete guide to deploy your Full-Stack Todo App frontend to Vercel.

## Prerequisites

- ✅ GitHub repository: https://github.com/asadshabir/full-stack-todo-app
- ✅ Backend deployed on Railway (get the URL first)
- ✅ Vercel account (free tier works perfectly)

## Important: Deploy Backend First!

**⚠️ CRITICAL**: You MUST deploy the backend to Railway BEFORE deploying the frontend to Vercel, because you need the backend URL for the frontend environment variable.

### Quick Backend Deployment (if not done yet)

1. Go to https://railway.app/
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Select `asadshabir/full-stack-todo-app`
5. Root Directory: `backend`
6. Add environment variables (see DEPLOYMENT.md)
7. Deploy and **COPY THE RAILWAY URL**

Example Railway URL: `https://full-stack-todo-app-production-xxxx.up.railway.app`

---

## Step-by-Step Vercel Deployment

### Step 1: Sign In to Vercel

1. Go to https://vercel.com/
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. From Vercel Dashboard, click **"Add New..."** (top right)
2. Select **"Project"**
3. You'll see "Import Git Repository"
4. Find and click **"Import"** next to `asadshabir/full-stack-todo-app`

### Step 3: Configure Project Settings

Vercel will auto-detect most settings, but you need to configure:

#### 3.1 Framework Preset
- Should auto-detect as: **Next.js**
- If not, select "Next.js" from dropdown

#### 3.2 Root Directory
- Click **"Edit"** next to "Root Directory"
- Enter: `frontend`
- Click **"Continue"**

#### 3.3 Build Settings (Auto-detected, verify these)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

All should be auto-detected correctly. ✅

### Step 4: Add Environment Variables

This is the MOST IMPORTANT step!

1. Scroll down to **"Environment Variables"** section
2. Click to expand it
3. Add the following variable:

**Variable Name:**
```
NEXT_PUBLIC_API_URL
```

**Value:**
```
https://your-railway-backend-url.railway.app
```

⚠️ **IMPORTANT**:
- Replace with YOUR actual Railway backend URL
- Do NOT include a trailing slash (/)
- It should look like: `https://full-stack-todo-app-production-1234.up.railway.app`

4. **Select environments**: Check all three boxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. Click **"Add"**

### Step 5: Deploy!

1. Click the big **"Deploy"** button
2. Vercel will now:
   - Clone your repository
   - Install dependencies (npm install)
   - Build your Next.js app (npm run build)
   - Deploy to their global CDN

This usually takes **3-5 minutes**. ⏱️

### Step 6: Monitor Deployment

Watch the deployment logs in real-time:

- ✅ Green checks mean success
- ❌ Red X means error (check logs)
- 📝 Click "View Build Logs" to see detailed output

Common build issues and solutions:
- **Environment variable missing**: Go back and add NEXT_PUBLIC_API_URL
- **TypeScript errors**: Check your code for type errors
- **Dependency issues**: Check package.json

### Step 7: Get Your Vercel URL

Once deployment succeeds:

1. You'll see: **"Congratulations! Your project has been deployed"** 🎉
2. Vercel will show your URL, like:
   ```
   https://full-stack-todo-app-xxxx.vercel.app
   ```
3. **COPY THIS URL** - you'll need it for the next step

### Step 8: Update Backend CORS

Now update your Railway backend to allow requests from Vercel:

1. Go back to Railway Dashboard
2. Click on your backend service
3. Go to **"Variables"** tab
4. Find **`CORS_ORIGINS`**
5. Update it to include your Vercel URL:
   ```
   http://localhost:3000,https://your-vercel-app.vercel.app
   ```
6. Click **"Save"** or **"Update"**
7. Railway will automatically redeploy

⏱️ Wait 1-2 minutes for Railway to redeploy.

### Step 9: Test Your Deployment

Visit your Vercel URL and test the complete flow:

1. **Landing Page**: Should load instantly ✅
2. **Click "Sign Up"**: Create a new account
3. **After Signup**: Should redirect to dashboard
4. **Dashboard**: Should show "No todos yet"
5. **Create Todo**: Click "+" and create a todo
6. **Edit Todo**: Click edit icon and modify
7. **Toggle Todo**: Mark as complete/incomplete
8. **Delete Todo**: Delete the todo
9. **Sign Out**: Click sign out
10. **Sign In**: Log back in with your credentials

## Troubleshooting

### Issue: "Network Error" or "Failed to fetch"

**Problem**: Frontend can't connect to backend

**Solutions**:
1. ✅ Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. ✅ Check Railway backend is running (visit the URL)
3. ✅ Verify CORS_ORIGINS in Railway includes your Vercel URL
4. ✅ Make sure URLs don't have trailing slashes

**How to check environment variables**:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click "Edit" to verify the value
3. If you change it, click "Redeploy" to apply changes

### Issue: Pages show 404 Not Found

**Problem**: Routing not working

**Solutions**:
1. ✅ Make sure Root Directory is set to `frontend`
2. ✅ Vercel should auto-detect Next.js routing
3. ✅ Check Build Logs for errors

### Issue: "Authentication required" immediately after login

**Problem**: Cookies not being set/sent

**Solutions**:
1. ✅ Check backend is setting cookies (check `/api/auth/signin` response headers)
2. ✅ Verify CORS configuration allows credentials
3. ✅ Check browser console for CORS errors

### Issue: Environment variables not updating

**Problem**: Changes not taking effect

**Solutions**:
1. ✅ After changing environment variables, you MUST redeploy
2. ✅ Go to Vercel → Deployments → Three dots → Redeploy
3. ✅ Or push a new commit to trigger automatic deployment

### Issue: Build fails with TypeScript errors

**Problem**: Type checking fails during build

**Solutions**:
1. ✅ Run `npm run build` locally first to catch errors
2. ✅ Fix TypeScript errors in your code
3. ✅ Push the fixes to GitHub
4. ✅ Vercel will auto-deploy the fix

## Post-Deployment Checklist

After successful deployment, verify:

- [ ] Landing page loads quickly
- [ ] Sign up creates new user successfully
- [ ] Sign in authenticates and redirects to dashboard
- [ ] Dashboard shows user's todos
- [ ] Can create new todos
- [ ] Can edit existing todos
- [ ] Can toggle todo completion status
- [ ] Can delete todos
- [ ] Sign out clears authentication
- [ ] Can sign back in
- [ ] All pages are responsive on mobile
- [ ] Dark mode toggle works
- [ ] No console errors in browser

## Custom Domain (Optional)

To add a custom domain:

1. Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `mytodoapp.com`)
4. Follow DNS configuration instructions
5. Update Railway CORS_ORIGINS to include custom domain

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main` branch**: Deploys to production
- **Push to other branches**: Creates preview deployments
- **Pull Requests**: Creates preview deployments with unique URLs

You can disable auto-deployment in Settings if needed.

## Vercel Analytics (Optional but Recommended)

Enable free analytics:

1. Vercel Dashboard → Your Project → Analytics
2. Click "Enable Analytics"
3. View real-time traffic, performance, and user metrics

## Environment Variables Reference

For Vercel frontend deployment, you need:

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | `https://backend.railway.app` | Railway backend URL |

## Deployment URLs

Save these for your records:

- **GitHub**: https://github.com/asadshabir/full-stack-todo-app
- **Railway Backend**: `https://your-backend.railway.app`
- **Vercel Frontend**: `https://your-app.vercel.app`
- **API Docs**: `https://your-backend.railway.app/docs`

## Support

If you encounter issues:

1. Check Vercel build logs for errors
2. Check Railway logs for backend issues
3. Test backend directly: `https://your-backend.railway.app/health`
4. Check browser console for frontend errors
5. Verify environment variables in Vercel dashboard

## Next Steps

1. ✅ Add custom domain (optional)
2. ✅ Enable Vercel Analytics
3. ✅ Set up error monitoring (Sentry)
4. ✅ Configure automated backups
5. ✅ Share your app with users!

---

**Your app is now live! 🚀**

Test it thoroughly and enjoy your deployed application!
