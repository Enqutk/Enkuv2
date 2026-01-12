# Vercel Database Setup Guide

## Problem: "Route not found" or "Error loading blog posts"

This error occurs when your Vercel deployment can't connect to your database. The backend API routes need a working database connection.

## Solution: Set Up Database Environment Variables on Vercel

### Step 1: Get Your Database Credentials

If you're using Railway (recommended):

1. Go to your Railway dashboard
2. Select your MySQL database service
3. Go to the **Variables** tab
4. Copy these values:
   - `MYSQLHOST` → Use for `DB_HOST`
   - `MYSQLPORT` → Use for `DB_PORT`
   - `MYSQLUSER` → Use for `DB_USER`
   - `MYSQLPASSWORD` → Use for `DB_PASSWORD`
   - `MYSQLDATABASE` → Use for `DB_NAME`

**Important:** Use the **public** hostname, not `mysql.railway.internal`!

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (`enkuv2`)
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
DB_HOST=your_railway_public_hostname (e.g., caboose.proxy.rlwy.net)
DB_PORT=your_mysql_port (e.g., 57952)
DB_USER=your_mysql_user (usually root)
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_SSL=false
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_admin_password
NODE_ENV=production
```

### Step 3: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment to complete

### Step 4: Verify Database Connection

1. Go to your Vercel deployment
2. Open browser console (F12)
3. Try to publish a blog post
4. Check for any error messages

## Alternative: Use a Separate Backend Server

If Vercel serverless functions don't work well with your database, you can:

1. **Deploy backend separately** on Railway, Render, or Heroku
2. **Update API URL** in `js/api.js`:

```javascript
const API_BASE_URL = 'https://your-backend.railway.app/api';
```

3. **Update Vercel environment variable:**
   - Add `API_URL=https://your-backend.railway.app/api`

## Troubleshooting

### "Route not found" Error

**Cause:** API routes aren't loading or database connection is failing.

**Solution:**
1. Check Vercel deployment logs:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment
   - Check **Functions** tab for errors
2. Verify all environment variables are set correctly
3. Make sure database is accessible from Vercel (not just localhost)

### "Database connection failed" Error

**Cause:** Database credentials are wrong or database isn't accessible.

**Solution:**
1. Double-check all database credentials in Vercel environment variables
2. Make sure you're using the **public** hostname (not internal)
3. Verify database allows connections from Vercel's IP addresses
4. Check Railway database is running and accessible

### "Authentication required" Error

**Cause:** Not logged in or token expired.

**Solution:**
1. Go to `admin-login.html`
2. Log in again
3. Make sure `JWT_SECRET` is set in Vercel environment variables

## Quick Test

After setting up environment variables:

1. **Test API health:**
   ```
   https://enkuv2.vercel.app/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Test login:**
   - Go to `https://enkuv2.vercel.app/admin-login.html`
   - Try logging in with your admin credentials

3. **Test publishing:**
   - After login, try publishing a blog post
   - Should work without "Route not found" error

## Important Notes

⚠️ **Security:**
- Never commit `.env` file to Git
- Use strong passwords for database and admin
- Keep `JWT_SECRET` secure and unique
- Use different credentials for production vs development

✅ **Best Practices:**
- Use Railway or Render for database (free tiers available)
- Keep database credentials in Vercel environment variables only
- Test locally first before deploying
- Monitor Vercel function logs for errors
