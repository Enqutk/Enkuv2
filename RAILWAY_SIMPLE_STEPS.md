# Railway Database Connection - Simple Steps

## What You Need to Find

You need to find a **public hostname** that looks like one of these:
- `containers-us-west-xxx.railway.app`
- `monorail.proxy.rlwy.net`
- `xxx.railway.app`

**NOT** `mysql.railway.internal` (that's internal only)

## Step-by-Step Instructions

### Step 1: In Railway Dashboard
You're already on the **Variables** tab - that's correct! ✅

### Step 2: Look for These Variable Names
Scroll through the list and look for variables with these names:

1. **`MYSQLHOST`** ← This is what you want!
2. **`MYSQL_HOST`** ← Alternative name
3. **`DATABASE_URL`** ← Full connection string
4. **`MYSQL_URL`** ← Alternative connection string

### Step 3: Reveal the Value
1. Find one of the variables above
2. Click the **👁️ eye icon** next to it (to show the hidden value)
3. Copy the value

### Step 4: What to Look For

**If you see `MYSQLHOST`:**
- The value should be something like: `containers-us-west-123.railway.app`
- **This is your public hostname!** ✅
- Copy this entire hostname

**If you see `DATABASE_URL`:**
- It will look like: `mysql://root:password@containers-us-west-123.railway.app:3306/railway`
- The hostname is the part between `@` and `:3306`
- Example: `containers-us-west-123.railway.app` ← Copy this part

### Step 5: Update Your .env File

Once you have the hostname, update your `.env`:

```env
DB_HOST=containers-us-west-123.railway.app
```

(Replace with your actual hostname)

## Still Can't Find It?

### Option A: Check the "Connect" Tab
1. In Railway, go to your MySQL service
2. Look for a **"Connect"** button or tab
3. Click it - it should show connection details including the public hostname

### Option B: Check Service Settings
1. Click on your MySQL service
2. Go to **"Settings"** tab
3. Look for **"Public Networking"** or **"Connection"** section
4. The public hostname should be listed there

### Option C: Use Railway CLI
If you have Railway CLI installed:
```bash
railway variables
```
This will show all variables including the public hostname.

## Quick Test

After updating `.env` with the public hostname, test:
```bash
npm run setup-db
```

If it works, you'll see: `✅ Database setup completed successfully!`

## Common Issues

**"I only see `mysql.railway.internal`"**
- This is the internal hostname (won't work locally)
- Look for `MYSQLHOST` or `DATABASE_URL` variables
- They might be further down in the list

**"I don't see any HOST variable"**
- Check the "Connect" tab in your MySQL service
- Or check "Settings" → "Public Networking"
- The public hostname should be displayed there

**"All values are hidden"**
- Click the eye icon (👁️) to reveal values
- You need to see the actual hostname to copy it
