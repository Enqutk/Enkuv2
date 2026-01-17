# Fix Vercel Deployment Issues

## Problem
Your site is deployed but showing:
- "Loading featured posts..." (stuck)
- "0 Projects" and "0 Happy Clients"
- No data loading from database

## Root Cause
The database environment variables are likely **not set in Vercel**, so the API can't connect to Railway.

## Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Log in to your account
3. Click on your project: **enkuv2**

### Step 2: Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Click **"Add New"** for each variable below:

**Database Variables:**
```
DB_HOST = caboose.proxy.rlwy.net
DB_USER = root
DB_PASSWORD = lCVJTeYmfJCtbqoaoeqAtmMrHNgvwQkL
DB_NAME = railway
DB_PORT = 57952
DB_SSL = false
```

**Application Variables:**
```
JWT_SECRET = your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE = 7d
ADMIN_EMAIL = admin@example.com
ADMIN_PASSWORD = admin123
FRONTEND_URL = https://enkuv2.vercel.app
NODE_ENV = production
```

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~2-3 minutes)

### Step 4: Test
1. Visit: `https://enkuv2.vercel.app/api/health`
   - Should return: `{"status":"ok"}` ✅

2. Visit: `https://enkuv2.vercel.app/api/blog`
   - Should return: `[]` (empty array if no posts, or array of posts) ✅

3. Visit: `https://enkuv2.vercel.app/api/projects`
   - Should return: `[]` (empty array if no projects) ✅

4. Visit: `https://enkuv2.vercel.app/`
   - Should load without "Loading..." messages ✅

## If Still Not Working

### Check Vercel Logs
1. Go to **Deployments** → Click on latest deployment
2. Click **"Functions"** tab
3. Check for error messages
4. Look for database connection errors

### Common Issues

**"Database connection error"**
- Verify all DB_* variables are set correctly
- Check Railway database is running
- Verify hostname and port are correct

**"Cannot connect to database"**
- Railway might require public networking enabled
- Check Railway dashboard → MySQL service → Settings → Networking

**"API returns 500 error"**
- Check Vercel function logs
- Look for specific error messages
- Verify database credentials

## Quick Test Commands

Test API endpoints:
```bash
# Health check
curl https://enkuv2.vercel.app/api/health

# Blog posts
curl https://enkuv2.vercel.app/api/blog

# Projects
curl https://enkuv2.vercel.app/api/projects

# Gallery
curl https://enkuv2.vercel.app/api/gallery
```

All should return JSON (even if empty arrays).

## After Fixing

Once environment variables are set and redeployed:
1. The site should load data from Railway database
2. "Loading..." messages should disappear
3. Stats should update when you add content via admin panel
4. All features should work
