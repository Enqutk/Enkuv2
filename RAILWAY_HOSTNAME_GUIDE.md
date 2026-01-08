# How to Get Railway Public Hostname

## The Problem
`mysql.railway.internal` only works **inside** Railway's network. For local development, you need the **public hostname**.

## Step-by-Step Guide

### Method 1: From Railway Dashboard (Easiest)

1. **Go to Railway Dashboard:**
   - Visit [railway.app](https://railway.app)
   - Log in to your account

2. **Open Your Project:**
   - Click on your project that contains the MySQL database

3. **Click on MySQL Service:**
   - You'll see your MySQL service listed
   - Click on it to open the service details

4. **Go to Variables Tab:**
   - Click on **"Variables"** tab (or **"Settings"** → **"Variables"**)

5. **Find the Public Hostname:**
   Look for one of these variables:
   - **`MYSQLHOST`** - This is the public hostname (use this!)
   - **`MYSQL_HOST`** - Alternative name
   - **`DATABASE_URL`** - Full connection string

6. **Copy the Hostname:**
   - The hostname will look like one of these:
     - `containers-us-west-xxx.railway.app`
     - `monorail.proxy.rlwy.net`
     - `xxx.railway.app`
   - **DO NOT** use `mysql.railway.internal` (that's internal only)

### Method 2: From Connection String

If you see `DATABASE_URL` or `MYSQL_URL`:

1. It will look like:
   ```
   mysql://root:password@containers-us-west-xxx.railway.app:3306/railway
   ```

2. Extract the hostname (the part after `@` and before `:`):
   ```
   containers-us-west-xxx.railway.app
   ```

### Method 3: From Railway CLI

If you have Railway CLI installed:

```bash
railway variables
```

Look for `MYSQLHOST` in the output.

## Update Your .env File

Once you have the public hostname, update your `.env`:

```env
DB_HOST=containers-us-west-xxx.railway.app
# (Replace with your actual public hostname)
DB_USER=root
DB_PASSWORD=lCVJTeYmfJCtbqoaoeqAtmMrHNgvwQkL
DB_NAME=railway
DB_PORT=3306
DB_SSL=false
```

## Common Railway Hostname Formats

- `containers-us-west-xxx.railway.app`
- `containers-us-east-xxx.railway.app`
- `monorail.proxy.rlwy.net`
- `xxx.railway.app`

**Any of these formats will work - just make sure it's NOT `mysql.railway.internal`**

## Test Connection

After updating, test:

```bash
npm run setup-db
```

Should see: `✅ Database setup completed successfully!`

## Still Can't Find It?

1. Check if MySQL service is running (should be green/active)
2. Make sure you're looking at the **Variables** tab, not **Settings**
3. Try refreshing the Railway dashboard
4. Check if there's a **"Connect"** button that shows connection details
