# Deploying to Vercel - Complete Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm i -g vercel
   ```
3. **Database**: Set up a cloud MySQL database (see options below)

## Step 1: Set Up Cloud Database

Vercel doesn't support MySQL directly. Choose one of these options:

### Option A: PlanetScale (Recommended - Free Tier)
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get your connection string from the dashboard
4. Note: PlanetScale uses a slightly different connection format

### Option B: Railway
1. Sign up at [railway.app](https://railway.app)
2. Create a new MySQL service
3. Get connection details from the service dashboard

### Option C: AWS RDS / Clever Cloud / Other
- Follow your provider's documentation for MySQL setup

## Step 2: Prepare Your Project

1. **Make sure all dependencies are installed:**
   ```bash
   npm install
   ```

2. **Update API URL** (already done in `js/api.js` - it auto-detects)

3. **Test locally first:**
   ```bash
   npm start
   ```

## Step 3: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default)
   - Directory? (Press Enter for current directory)
   - Override settings? **No**

3. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Vercel will auto-detect the settings
4. Configure environment variables (see Step 4)
5. Deploy!

## Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Required Variables:

```env
# Database Configuration
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Frontend URL (your Vercel domain)
FRONTEND_URL=https://your-project.vercel.app

# Node Environment
NODE_ENV=production
```

### Optional Variables:

```env
# Email Configuration (if using contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

## Step 5: Set Up Database

After deployment, you need to run the database setup script. You have two options:

### Option A: Run Setup Script Locally (Recommended)

1. Update your local `.env` with your cloud database credentials
2. Run:
   ```bash
   npm run setup-db
   ```
3. This will create all tables and the admin user

### Option B: Use Vercel CLI to Run Script

1. Use Vercel's serverless functions or run locally with cloud DB credentials

## Step 6: Verify Deployment

1. **Check API Health:**
   Visit: `https://your-project.vercel.app/api/health`
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Admin Login:**
   Visit: `https://your-project.vercel.app/admin-login.html`
   Use your admin credentials

3. **Test Frontend:**
   Visit: `https://your-project.vercel.app/`

## Important Notes

### File Uploads
- Vercel has a **10-second execution limit** for serverless functions
- Large file uploads might timeout
- Consider using **Vercel Blob Storage** or **AWS S3** for production file storage
- Update `middleware/upload.js` to use cloud storage

### Database Connections
- Use connection pooling for better performance
- PlanetScale has connection limits on free tier
- Consider using a connection pooler like PgBouncer for MySQL

### Environment Variables
- Never commit `.env` file to Git
- All secrets should be in Vercel dashboard
- Use different credentials for production vs development

### CORS
- Update `FRONTEND_URL` in Vercel to match your actual domain
- If using custom domain, add it to CORS allowed origins

## Troubleshooting

### "Cannot connect to database"
- Check database credentials in Vercel environment variables
- Verify database allows connections from Vercel IPs
- Check if database requires SSL (add SSL config to connection)

### "API routes not working"
- Check `vercel.json` configuration
- Verify routes are correctly defined
- Check Vercel function logs

### "Static files not loading"
- Check file paths (use relative paths)
- Verify files are not in `.vercelignore`
- Check browser console for 404 errors

### "File uploads not working"
- Vercel serverless functions have limited storage
- Consider using cloud storage (S3, Vercel Blob, etc.)
- Update upload middleware

## Next Steps

1. **Set up custom domain** (optional)
   - In Vercel dashboard → Settings → Domains
   - Add your domain and follow DNS instructions

2. **Enable Analytics** (optional)
   - Vercel Analytics in dashboard

3. **Set up CI/CD**
   - Push to Git → Auto-deploy on Vercel

4. **Monitor Performance**
   - Check Vercel dashboard for function logs
   - Monitor database connections

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Project Issues: Check GitHub issues
