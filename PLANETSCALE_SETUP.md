# PlanetScale Setup Guide - Complete Walkthrough

**⚠️ Important Update (2024):** PlanetScale discontinued their free Hobby plan in April 2024. They now require a paid subscription starting at $5/month. 

**If you're looking for a free alternative, see the "Free Alternatives" section below.**

PlanetScale is a MySQL-compatible serverless database platform that works perfectly with Vercel. It's ideal for this portfolio project if you're okay with a paid plan.

## Step 1: Create PlanetScale Account

1. **Go to PlanetScale:**
   - Visit [planetscale.com](https://planetscale.com)
   - Click **"Sign up"** or **"Get started"**

2. **Sign up options:**
   - Sign up with **GitHub** (recommended - easiest)
   - Or use **Email** and create a password

3. **Verify your email** (if using email signup)

## Step 2: Create Your Database

1. **After logging in, you'll see the dashboard**
   - Click the **"Create database"** button (or **"New database"** or **"Create"**)

2. **Database settings:**
   - **Name:** `enku-portfolio` (or any name you prefer)
   - **Region:** Choose closest to you (e.g., `us-east-1`, `eu-west-1`, `ap-south-1`)
   - **Plan:** You'll need to select a paid plan (starting at $5/month for Base plan)
   - **Note:** PlanetScale no longer offers a free tier (discontinued April 2024). If you don't see plan options, you may need to add a payment method first.
   - Click **"Create database"** or **"Create"**

3. **Wait for database creation** (takes ~30 seconds)
   - You'll see a progress indicator
   - When done, you'll be taken to your database dashboard

## Step 3: Get Connection Credentials

1. **In your database dashboard, click on your database**

2. **Click "Connect" button** (top right or in the overview)

3. **You'll see connection options:**
   - Select **"Node.js"** or **"General"**
   - You'll see a connection string like:
     ```
     mysql://[username]:[password]@[host]/[database]?sslaccept=strict
     ```

4. **Copy the connection string** - You'll need this!

5. **Also note these values separately:**
   - **Host:** (e.g., `aws.connect.psdb.cloud`)
   - **Username:** (e.g., `abc123xyz`)
   - **Password:** (Click "Show password" and copy it)
   - **Database name:** (e.g., `enku-portfolio`)
   - **Port:** Usually `3306`

## Step 4: Create a Branch (Development Workflow)

PlanetScale uses branching (like Git) for database changes:

1. **In your database dashboard, click "Branches"**

2. **Click "Create branch"**
   - **Name:** `main` (or `production`)
   - **Base branch:** `main`
   - Click **"Create branch"**

3. **Make sure you're on the `main` branch** (you'll see it in the top)

## Step 5: Update Your Local .env File

1. **Open your `.env` file** (create from `env.example` if needed)

2. **Update database credentials:**
   ```env
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=your-planetscale-username
   DB_PASSWORD=your-planetscale-password
   DB_NAME=enku-portfolio
   DB_PORT=3306
   ```

   **Important:** Replace with your actual PlanetScale credentials!

3. **Add SSL configuration** (PlanetScale requires SSL):
   ```env
   DB_SSL=true
   ```

## Step 6: Update Database Connection Code

PlanetScale requires SSL connections. Let's update the database config:

### Update `config/database.js`:

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // PlanetScale requires SSL
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true
  } : false
});

module.exports = pool;
```

## Step 7: Run Database Setup

1. **Make sure your `.env` has PlanetScale credentials**

2. **Run the setup script:**
   ```bash
   npm run setup-db
   ```

3. **You should see:**
   ```
   📦 Creating database...
   📋 Creating tables...
   ✅ Admin user created:
      Email: admin@example.com
      Password: admin123
   ✅ Database setup completed successfully!
   ```

## Step 8: Verify Database Setup

1. **Go back to PlanetScale dashboard**

2. **Click on your database → "Console" tab**

3. **Run a test query:**
   ```sql
   SHOW TABLES;
   ```

4. **You should see all your tables:**
   - `users`
   - `blog_posts`
   - `gallery_items`
   - `projects`
   - `comments`
   - `newsletter_subscribers`
   - `contact_messages`
   - `analytics`
   - `testimonials`

5. **Check if admin user was created:**
   ```sql
   SELECT * FROM users;
   ```

## Step 9: Test Your Connection

1. **Start your local server:**
   ```bash
   npm start
   ```

2. **Test the API:**
   - Visit: `http://localhost:3000/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test admin login:**
   - Visit: `http://localhost:5500/admin-login.html`
   - Use credentials from your `.env`:
     - Email: `admin@example.com` (or your `ADMIN_EMAIL`)
     - Password: `admin123` (or your `ADMIN_PASSWORD`)

## Step 10: Configure for Vercel Deployment

### Option A: Using Connection String (Recommended)

1. **In PlanetScale dashboard → Connect → Node.js**

2. **Copy the connection string:**
   ```
   mysql://username:password@host/database?sslaccept=strict
   ```

3. **In Vercel Dashboard → Your Project → Settings → Environment Variables:**

   Add these variables:
   ```env
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=enku-portfolio
   DB_PORT=3306
   DB_SSL=true
   ```

### Option B: Using PlanetScale Connection String Parser

If you prefer to use the full connection string, you can parse it:

```javascript
// Example: Parse connection string
const url = new URL(process.env.DATABASE_URL);
const config = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  port: url.port || 3306,
  ssl: { rejectUnauthorized: true }
};
```

## Step 11: Deploy to Vercel

1. **Make sure all environment variables are set in Vercel**

2. **Deploy your project:**
   ```bash
   vercel --prod
   ```

3. **After deployment, test:**
   - Visit: `https://your-project.vercel.app/api/health`
   - Should work!

## Important PlanetScale Notes

### Branching Workflow

PlanetScale uses branches for database changes:

- **Main branch:** Production database
- **Development branches:** For testing changes
- **Schema changes:** Create a branch → Make changes → Create deploy request → Merge

### Connection Limits (Free Tier)

- **5 connections** per database
- Use connection pooling (already configured in `config/database.js`)
- Don't create too many simultaneous connections

### Database Size (Free Tier)

- **5 GB storage** (plenty for a portfolio)
- **1 billion row reads/month**
- **10 million row writes/month**

### SSL Requirements

- **Always use SSL** with PlanetScale
- Connection will fail without SSL
- Already configured in the code above

## Troubleshooting

### "Access denied" Error

- **Check credentials** in `.env`
- **Verify password** (copy it again from PlanetScale)
- **Check username** is correct

### "SSL connection required" Error

- **Add `DB_SSL=true`** to `.env`
- **Update `config/database.js`** with SSL config (see Step 6)

### "Too many connections" Error

- **Free tier limit:** 5 connections
- **Solution:** Use connection pooling (already configured)
- **Check:** Don't create multiple pools

### Connection Timeout

- **Check region:** Use closest region to your server
- **Check firewall:** PlanetScale doesn't require IP whitelisting
- **Verify host:** Should be `*.psdb.cloud`

### Tables Not Created

- **Run setup script again:** `npm run setup-db`
- **Check console:** Look for error messages
- **Verify database name** matches in `.env`

## Next Steps

1. ✅ Database created on PlanetScale
2. ✅ Local connection working
3. ✅ Tables created
4. ✅ Admin user created
5. ⏭️ Deploy to Vercel
6. ⏭️ Add environment variables in Vercel
7. ⏭️ Test production deployment

## Useful PlanetScale Features

### Database Console

- **SQL Editor:** Run queries directly in dashboard
- **Schema:** View table structures
- **Branches:** Manage database branches
- **Insights:** View query performance

### Backup & Restore

- **Automatic backups** on paid plans
- **Point-in-time recovery** available
- **Export data** via console

### Monitoring

- **Query insights** in dashboard
- **Connection monitoring**
- **Performance metrics**

## Free Database Alternatives

Since PlanetScale no longer offers a free tier, here are excellent free alternatives:

### Option 1: Railway (Recommended - Free Tier Available)

1. **Sign up:** [railway.app](https://railway.app)
2. **Create MySQL service:**
   - Click "New Project"
   - Select "Database" → "MySQL"
   - Free tier includes: 512 MB RAM, 1 GB storage, $5 credit/month
3. **Get connection string** from the service dashboard
4. **Use same `.env` format** as PlanetScale (set `DB_SSL=false`)

**See `FREE_DATABASE_ALTERNATIVES.md` for complete setup guide with Railway and other options.**

## Support

- **PlanetScale Docs:** https://docs.planetscale.com
- **PlanetScale Pricing:** https://planetscale.com/pricing
- **PlanetScale Discord:** https://discord.gg/planetscale
- **PlanetScale Status:** https://status.planetscale.com

---

**Note:** If you choose a free alternative like Railway, the setup process is similar - just get the connection credentials and update your `.env` file accordingly. See `FREE_DATABASE_ALTERNATIVES.md` for detailed guides. 🚀
