# PlanetScale Quick Start - 5 Minute Setup

**⚠️ Note:** PlanetScale no longer offers a free tier (as of April 2024). You'll need a paid plan starting at $5/month.

**Looking for free alternatives?** See `FREE_DATABASE_ALTERNATIVES.md` for Railway, Render, and other free options.

## 🚀 Quick Steps (Paid Plan Required)

### 1. Sign Up (1 minute)
- Go to [planetscale.com](https://planetscale.com)
- Sign up with GitHub (easiest) or email
- Verify email if needed

### 2. Create Database (1 minute)
- Click **"Create database"** or **"New database"**
- Name: `enku-portfolio`
- Region: Choose closest to you
- **Note:** Free tier is automatically selected (no plan selection needed)
- Click **"Create database"** or **"Create"**

### 3. Get Credentials (1 minute)
- Click **"Connect"** button
- Select **"Node.js"** or **"General"**
- Copy these values:
  - **Host** (e.g., `aws.connect.psdb.cloud`)
  - **Username**
  - **Password** (click "Show password")
  - **Database name**

### 4. Update .env File (1 minute)
Create/update your `.env` file:
```env
DB_HOST=aws.connect.psdb.cloud
DB_USER=your-username-here
DB_PASSWORD=your-password-here
DB_NAME=enku-portfolio
DB_PORT=3306
DB_SSL=true
```

### 5. Setup Database (1 minute)
```bash
npm run setup-db
```

**Done!** ✅ Your database is ready.

## 🧪 Test It

```bash
npm start
```

Visit: `http://localhost:3000/api/health`

Should return: `{"status":"ok","timestamp":"..."}`

## 📝 For Vercel

Add the same environment variables in Vercel Dashboard:
- Settings → Environment Variables
- Add all DB_* variables from your `.env`

## ❓ Need Help?

See `PLANETSCALE_SETUP.md` for detailed guide with troubleshooting.
