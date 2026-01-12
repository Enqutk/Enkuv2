# Quick Fix: "API route not found" Error on Vercel

## The Problem
Your admin panel can't publish blog posts because Vercel can't connect to your database. The API routes need database credentials to work.

## Solution: Add Database Environment Variables to Vercel

### Step 1: Get Your Railway Database Credentials

1. Go to **Railway Dashboard**: https://railway.app/dashboard
2. Click on your **MySQL database** service
3. Go to the **Variables** tab
4. You'll see these variables - **copy their values**:

   - `MYSQLHOST` → This is your `DB_HOST` (use the PUBLIC one, not `mysql.railway.internal`)
   - `MYSQLPORT` → This is your `DB_PORT`
   - `MYSQLUSER` → This is your `DB_USER` (usually `root`)
   - `MYSQLPASSWORD` → This is your `DB_PASSWORD`
   - `MYSQLDATABASE` → This is your `DB_NAME`

**⚠️ Important:** For `DB_HOST`, use the **public hostname** from Railway (like `caboose.proxy.rlwy.net`), NOT `mysql.railway.internal`

### Step 2: Add Environment Variables to Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project (`enkuv2`)
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** button

6. Add each variable one by one:

   **Variable 1:**
   - **Key:** `DB_HOST`
   - **Value:** Your Railway `MYSQLHOST` (public hostname)
   - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

   **Variable 2:**
   - **Key:** `DB_PORT`
   - **Value:** Your Railway `MYSQLPORT`
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 3:**
   - **Key:** `DB_USER`
   - **Value:** Your Railway `MYSQLUSER` (usually `root`)
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 4:**
   - **Key:** `DB_PASSWORD`
   - **Value:** Your Railway `MYSQLPASSWORD`
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 5:**
   - **Key:** `DB_NAME`
   - **Value:** Your Railway `MYSQLDATABASE`
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 6:**
   - **Key:** `DB_SSL`
   - **Value:** `false`
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 7:**
   - **Key:** `JWT_SECRET`
   - **Value:** Any random string (e.g., `my-super-secret-jwt-key-12345`)
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 8:**
   - **Key:** `JWT_EXPIRE`
   - **Value:** `7d`
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 9:**
   - **Key:** `ADMIN_EMAIL`
   - **Value:** Your admin email (e.g., `admin@example.com`)
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 10:**
   - **Key:** `ADMIN_PASSWORD`
   - **Value:** Your admin password (e.g., `admin123`)
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 11:**
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   - **Environment:** Production, Preview, Development
   - Click **Save**

### Step 3: Redeploy Your Site

1. Go to **Deployments** tab in Vercel
2. Find your latest deployment
3. Click the **3 dots** (⋯) menu
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

### Step 4: Test It

1. Go to: `https://enkuv2.vercel.app/admin-login.html`
2. Log in with your admin credentials
3. Try publishing a blog post
4. It should work now! ✅

## Still Not Working?

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Click **Functions** tab
4. Look for any error messages
5. Check if database connection errors appear

### Verify Database is Accessible

1. Make sure your Railway database is **running** (not paused)
2. Check that you're using the **public hostname** (not internal)
3. Verify the port number is correct

### Test API Health Endpoint

Try visiting: `https://enkuv2.vercel.app/api/health`

Should return: `{"status":"ok",...}`

If it returns an error, the database connection is still not working.

## Need Help?

If you're still stuck:
1. Check Vercel function logs for specific error messages
2. Verify all environment variables are set correctly
3. Make sure Railway database is running and accessible
4. Try redeploying again after double-checking credentials
