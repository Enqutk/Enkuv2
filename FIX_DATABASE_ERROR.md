# Fix "Server error. Database connection issue" on Vercel

## The Problem
You're seeing: "Server error. This might be a database connection issue."

This means Vercel can't connect to your Railway database.

## Step-by-Step Fix

### Step 1: Verify Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Make sure you have ALL these variables with CORRECT values:

```
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=57952  ← Make sure this is 57952, NOT 3306!
DB_USER=root
DB_PASSWORD=lCVJTeYmfJCtbqoaoeqAtmMrHNgvwQkL
DB_NAME=railway
DB_SSL=false
JWT_SECRET=my-super-secret-jwt-key-12345
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
NODE_ENV=production
```

**⚠️ IMPORTANT:** 
- `DB_PORT` must be `57952` (from your connection string), NOT `3306`
- Each variable must have "Production, Preview, and Development" selected
- Click **Save** button at the bottom after adding/editing

### Step 2: Redeploy Your Site

**This is critical!** Environment variables only take effect after redeployment.

1. Go to **Deployments** tab in Vercel
2. Find your latest deployment
3. Click the **3 dots** (⋯) menu
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

### Step 3: Check Vercel Function Logs

If it still doesn't work, check the logs:

1. Go to **Deployments** → Click on the latest deployment
2. Click **Functions** tab
3. Look for any error messages
4. Check for database connection errors

Common errors you might see:
- `ECONNREFUSED` - Can't connect to database host
- `ER_ACCESS_DENIED_ERROR` - Wrong password
- `ENOTFOUND` - Wrong hostname
- `ETIMEDOUT` - Database not accessible

### Step 4: Verify Database is Running

1. Go to **Railway Dashboard**
2. Check that your MySQL database service is **running** (not paused)
3. Make sure it's not sleeping (free tier databases can sleep after inactivity)

### Step 5: Test Database Connection

Try accessing your database from Railway:

1. In Railway, click on your MySQL service
2. Click **Connect** or **Query** tab
3. Try running a simple query: `SELECT 1;`
4. If this works, the database is fine - the issue is with Vercel connection

### Step 6: Double-Check Port Number

**This is the most common mistake!**

Your connection string shows:
```
mysql://root:password@caboose.proxy.rlwy.net:57952/railway
```

So in Vercel, `DB_PORT` must be `57952`, NOT `3306`!

If you set it to `3306`, change it to `57952` and redeploy.

## Still Not Working?

### Check These Common Issues:

1. **Wrong Port:** `DB_PORT` should be `57952`, not `3306`
2. **Didn't Redeploy:** Environment variables only work after redeployment
3. **Database Sleeping:** Railway free tier databases can sleep - wake it up by connecting
4. **Wrong Hostname:** Must be `caboose.proxy.rlwy.net`, not `mysql.railway.internal`
5. **Environment Scope:** Make sure all variables have "Production, Preview, Development" selected

### Get More Details:

1. Open browser console (F12) on the login page
2. Try to log in
3. Check the Network tab for the `/api/auth/login` request
4. Look at the response - it might have more error details

### Alternative: Check Vercel Runtime Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Logs** tab (or **Observability** → **Logs**)
3. Try logging in again
4. Watch the logs in real-time for database connection errors

## Quick Checklist

- [ ] All 11 environment variables are added
- [ ] `DB_PORT` is `57952` (not `3306`)
- [ ] `DB_HOST` is `caboose.proxy.rlwy.net`
- [ ] All variables have "Production, Preview, Development" selected
- [ ] Clicked **Save** button
- [ ] Redeployed the site
- [ ] Railway database is running
- [ ] Waited 2-3 minutes after redeployment

If all of these are checked and it still doesn't work, share the error message from Vercel logs and I'll help debug further!
