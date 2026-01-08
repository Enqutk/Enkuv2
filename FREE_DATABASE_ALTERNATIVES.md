# Free Database Alternatives for Portfolio Project

Since PlanetScale no longer offers a free tier (as of April 2024), here are the best free alternatives for hosting your MySQL database.

## 🏆 Recommended: Railway

**Best for:** Easy setup, MySQL support, good free tier

### Setup Steps:

1. **Sign up:** [railway.app](https://railway.app) (use GitHub)

2. **Create MySQL Database:**
   - Click **"New Project"**
   - Click **"New"** → **"Database"** → **"MySQL"**
   - Railway will automatically create the database

3. **Get Connection Info:**
   - Click on your MySQL service
   - Go to **"Variables"** tab
   - You'll see:
     - `MYSQLHOST` (host)
     - `MYSQLUSER` (username)
     - `MYSQLPASSWORD` (password)
     - `MYSQLDATABASE` (database name)
     - `MYSQLPORT` (port, usually 3306)

4. **Update your `.env`:**
   ```env
   DB_HOST=[MYSQLHOST value]
   DB_USER=[MYSQLUSER value]
   DB_PASSWORD=[MYSQLPASSWORD value]
   DB_NAME=[MYSQLDATABASE value]
   DB_PORT=[MYSQLPORT value]
   DB_SSL=false
   ```

5. **Run setup:**
   ```bash
   npm run setup-db
   ```

**Free Tier:**
- 512 MB RAM
- 1 GB storage
- $5 credit/month (enough for small projects)
- No credit card required initially

---

## Option 2: Render

**Best for:** Simple interface, MySQL support

### Setup Steps:

1. **Sign up:** [render.com](https://render.com)

2. **Create MySQL Database:**
   - Click **"New +"** → **"PostgreSQL"** (they have MySQL too)
   - Select **"Free"** plan
   - Name your database
   - Click **"Create Database"**

3. **Get Connection Info:**
   - Click on your database
   - Find **"Connections"** section
   - Copy the connection details

4. **Update your `.env`** (same format as Railway)

**Free Tier:**
- 90 days free, then $7/month
- 1 GB storage
- Good for testing

---

## Option 3: Supabase (PostgreSQL)

**Best for:** Generous free tier, great features

**Note:** Uses PostgreSQL (not MySQL), so you'd need to modify the code slightly.

### Setup Steps:

1. **Sign up:** [supabase.com](https://supabase.com)

2. **Create Project:**
   - Click **"New Project"**
   - Fill in details
   - Wait for setup (~2 minutes)

3. **Get Connection String:**
   - Go to **"Settings"** → **"Database"**
   - Find **"Connection string"**
   - Copy the URI

4. **Code Changes Needed:**
   - Would need to switch from `mysql2` to `pg` (PostgreSQL driver)
   - SQL syntax slightly different
   - More work, but great free tier

**Free Tier:**
- 500 MB database
- 2 GB bandwidth
- Unlimited API requests
- Great for production

---

## Option 4: Neon (PostgreSQL)

**Best for:** Serverless PostgreSQL, generous free tier

**Note:** Also uses PostgreSQL (not MySQL)

### Setup Steps:

1. **Sign up:** [neon.tech](https://neon.tech)

2. **Create Project:**
   - Click **"Create Project"**
   - Select region
   - Click **"Create Project"**

3. **Get Connection String:**
   - Copy connection string from dashboard
   - Format: `postgresql://user:password@host/database`

**Free Tier:**
- 3 GB storage
- Unlimited projects
- Serverless (scales to zero)
- Great performance

---

## Option 5: Aiven (MySQL)

**Best for:** MySQL compatibility, free trial

### Setup Steps:

1. **Sign up:** [aiven.io](https://aiven.io)

2. **Create MySQL Service:**
   - Click **"Create service"**
   - Select **"MySQL"**
   - Choose plan (free trial available)

3. **Get Connection Details:**
   - From service overview page
   - Copy host, port, database, username, password

**Free Trial:**
- 2 weeks free trial
- Then pay-as-you-go
- Good for testing

---

## Quick Comparison

| Service | Database Type | Free Tier | Ease of Setup | Best For |
|---------|--------------|-----------|---------------|----------|
| **Railway** | MySQL | ✅ Yes ($5 credit) | ⭐⭐⭐⭐⭐ | **Recommended** |
| **Render** | MySQL | ⚠️ 90 days | ⭐⭐⭐⭐ | Quick testing |
| **Supabase** | PostgreSQL | ✅ Yes | ⭐⭐⭐ | Production apps |
| **Neon** | PostgreSQL | ✅ Yes | ⭐⭐⭐⭐ | Serverless needs |
| **Aiven** | MySQL | ⚠️ Trial | ⭐⭐⭐ | MySQL-specific |

---

## Recommendation

**For this portfolio project, I recommend Railway:**

✅ MySQL compatible (no code changes needed)  
✅ Easy setup  
✅ Good free tier ($5 credit/month)  
✅ Works perfectly with Vercel  
✅ Simple interface  

---

## Setup with Railway (Step-by-Step)

1. **Go to:** [railway.app](https://railway.app)

2. **Sign up with GitHub** (easiest)

3. **Create New Project:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"** (optional) or **"Empty Project"**

4. **Add MySQL Database:**
   - Click **"New"** button
   - Select **"Database"**
   - Choose **"MySQL"**
   - Railway creates it automatically

5. **Get Credentials:**
   - Click on the MySQL service
   - Go to **"Variables"** tab
   - Copy all the `MYSQL*` variables

6. **Update `.env`:**
   ```env
   DB_HOST=[from MYSQLHOST]
   DB_USER=[from MYSQLUSER]
   DB_PASSWORD=[from MYSQLPASSWORD]
   DB_NAME=[from MYSQLDATABASE]
   DB_PORT=[from MYSQLPORT]
   DB_SSL=false
   ```

7. **Run setup:**
   ```bash
   npm run setup-db
   ```

8. **Test:**
   ```bash
   npm start
   ```

**Done!** ✅

---

## For Vercel Deployment

Add the same environment variables in Vercel:
- Settings → Environment Variables
- Add all `DB_*` variables

Your database will work both locally and on Vercel! 🚀
