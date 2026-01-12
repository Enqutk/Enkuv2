# Fix "API route not found" on Vercel

## The Problem
You're seeing "API route not found" even after adding environment variables. This usually means:

1. **Routes aren't loading** - Database connection errors during startup
2. **Didn't redeploy** - Environment variables only work after redeployment
3. **Wrong configuration** - Serverless function setup issue

## Step-by-Step Fix

### Step 1: Verify Environment Variables Are Set

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Make sure you have ALL these variables:
   - `DB_HOST` = `caboose.proxy.rlwy.net`
   - `DB_PORT` = `57952` (NOT 3306!)
   - `DB_USER` = `root`
   - `DB_PASSWORD` = `lCVJTeYmfJCtbqoaoeqAtmMrHNgvwQkL`
   - `DB_NAME` = `railway`
   - `DB_SSL` = `false`
   - `JWT_SECRET` = (any random string)
   - `JWT_EXPIRE` = `7d`
   - `ADMIN_EMAIL` = `admin@example.com`
   - `ADMIN_PASSWORD` = `admin123`
   - `NODE_ENV` = `production`

3. **Make sure each variable has "Production, Preview, Development" selected**
4. **Click Save button**

### Step 2: Redeploy (CRITICAL!)

**This is the most important step!**

1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment to complete

### Step 3: Test the Health Endpoint

After redeployment, test if the API is working:

1. Open: `https://enkuv2.vercel.app/api/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

If this works, the API routes are loading correctly!

### Step 4: Check Vercel Function Logs

If it still doesn't work:

1. Go to **Deployments** → Latest deployment
2. Click **Functions** tab
3. Look for errors like:
   - `Database connection error`
   - `Cannot find module`
   - `Route not found`
   - `ER_ACCESS_DENIED_ERROR`

4. Share the error message and I'll help fix it

### Step 5: Verify Database is Accessible

1. Go to **Railway Dashboard**
2. Check that your MySQL database is **running** (not paused)
3. Make sure it's not sleeping

## Common Issues

### Issue 1: Wrong Port Number
**Symptom:** Database connection errors in logs

**Fix:** Make sure `DB_PORT` is `57952`, NOT `3306`

### Issue 2: Didn't Redeploy
**Symptom:** Environment variables are set but still getting errors

**Fix:** You MUST redeploy after adding/changing environment variables

### Issue 3: Database Sleeping
**Symptom:** Works sometimes, fails other times

**Fix:** Railway free tier databases can sleep. Wake it up by connecting from Railway dashboard

### Issue 4: Routes Not Loading
**Symptom:** `/api/health` returns 404

**Fix:** Check Vercel function logs for module loading errors

## Quick Checklist

- [ ] All 11 environment variables are added
- [ ] `DB_PORT` is `57952` (not 3306)
- [ ] All variables have "Production, Preview, Development" selected
- [ ] Clicked **Save** button
- [ ] **Redeployed** the site (most important!)
- [ ] Waited 2-3 minutes after redeployment
- [ ] Tested `/api/health` endpoint
- [ ] Railway database is running

## Still Not Working?

1. **Check Vercel Logs:**
   - Go to Deployments → Latest → Functions tab
   - Look for error messages
   - Share the error with me

2. **Test Health Endpoint:**
   - Visit: `https://enkuv2.vercel.app/api/health`
   - If this returns 404, routes aren't loading
   - If this returns 500, database connection issue

3. **Verify Environment Variables:**
   - Double-check all values are correct
   - Make sure no typos
   - Verify port number is `57952`

After doing all of this, the API routes should work! If not, share the error from Vercel logs and I'll help debug further.
