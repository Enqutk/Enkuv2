# Deploy to Vercel - Quick Guide

## Option 1: Using Vercel Dashboard (Easiest - No CLI needed)

### Step 1: Push to GitHub (if not already done)
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy via Vercel Dashboard

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in (use GitHub for easiest setup)

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your GitHub repository: `Enqutk/Enkuv2`
   - Click **"Import"**

3. **Configure Project:**
   - **Framework Preset:** Other (or leave default)
   - **Root Directory:** `./` (default)
   - **Build Command:** Leave empty (or `npm install`)
   - **Output Directory:** Leave empty
   - Click **"Deploy"**

4. **Add Environment Variables:**
   - After deployment starts, go to **Settings** → **Environment Variables**
   - Add these variables (from your `.env` file):

   ```
   DB_HOST=caboose.proxy.rlwy.net
   DB_USER=root
   DB_PASSWORD=lCVJTeYmfJCtbqoaoeqAtmMrHNgvwQkL
   DB_NAME=railway
   DB_PORT=57952
   DB_SSL=false
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=https://your-project.vercel.app
   NODE_ENV=production
   ```

5. **Redeploy:**
   - After adding variables, go to **Deployments** tab
   - Click the three dots (⋯) on latest deployment
   - Click **"Redeploy"**

## Option 2: Using Vercel CLI

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Login:
```bash
vercel login
```

### Deploy:
```bash
vercel
```

Follow the prompts, then:
```bash
vercel --prod
```

### Add Environment Variables:
```bash
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add DB_PORT
vercel env add DB_SSL
vercel env add JWT_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add FRONTEND_URL
vercel env add NODE_ENV
```

Then redeploy:
```bash
vercel --prod
```

## After Deployment

1. **Get your URL:**
   - Vercel will give you a URL like: `https://your-project.vercel.app`

2. **Update FRONTEND_URL:**
   - In Vercel dashboard → Environment Variables
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Redeploy

3. **Test:**
   - Visit: `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

4. **Admin Login:**
   - Visit: `https://your-project.vercel.app/admin-login.html`
   - Login with your admin credentials

## Important Notes

- **File Uploads:** Vercel has limited storage. Consider using Vercel Blob or AWS S3 for production
- **Database:** Your Railway database should work from Vercel
- **CORS:** Already configured in `server.js`
- **API URL:** Auto-detects production (uses `/api` on Vercel)

## Troubleshooting

**"Database connection error"**
- Check environment variables are set correctly
- Verify Railway database allows external connections
- Check `DB_HOST` and `DB_PORT` are correct

**"API not working"**
- Check `vercel.json` configuration
- Verify routes are correct
- Check Vercel function logs

**"Static files not loading"**
- Check file paths are relative
- Verify files are not in `.vercelignore`
