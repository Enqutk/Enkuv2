# Professional Portfolio Backend - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MySQL Database

1. Install MySQL if not already installed
2. Create a database (or let the script create it)
3. Update `.env` file with your MySQL credentials

### 3. Configure Environment

Create a `.env` file (copy from `env.example`):

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` with your settings:
- **DB_HOST**: localhost (or your MySQL host)
- **DB_USER**: your MySQL username
- **DB_PASSWORD**: your MySQL password
- **DB_NAME**: enku_portfolio (or your preferred name)
- **JWT_SECRET**: Generate a random secret key
- **ADMIN_EMAIL**: Your admin email
- **ADMIN_PASSWORD**: Your admin password

### 4. Initialize Database

```bash
npm run setup-db
```

This creates:
- Database and all tables
- Admin user account

### 5. Start Backend Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend will run on `http://localhost:3000`

### 6. Update Frontend API URL

Edit `js/api.js` and update:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Change to your backend URL when deployed.

### 7. Test the API

Visit: `http://localhost:3000/api/health`

Should return: `{"status":"ok","timestamp":"..."}`

## Frontend Integration

### Update Admin Panel

The admin panel needs to be updated to use the API. The `js/api.js` file provides all the methods needed.

### Login Flow

1. User enters email/password in admin panel
2. Call `api.login(email, password)`
3. Store token automatically
4. Use token for authenticated requests

### Example: Creating Blog Post

```javascript
const formData = new FormData();
formData.append('title', 'My Post');
formData.append('content', 'Post content...');
formData.append('featured', 'true');

if (imageFile) {
  formData.append('image', imageFile);
} else if (imageUrl) {
  formData.append('image', imageUrl);
}

const post = await api.createBlogPost(formData);
```

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Set Environment Variables

In Vercel dashboard, add all variables from `.env`

### 4. Database Options for Vercel

Vercel doesn't support MySQL directly. Use:
- **PlanetScale** (MySQL-compatible, free tier)
- **Railway** (MySQL hosting)
- **AWS RDS** (Production)
- **Clever Cloud** (MySQL hosting)

Update `DB_HOST` in Vercel environment variables.

## Features Included

✅ **Authentication** - JWT-based login
✅ **Blog Management** - Full CRUD operations
✅ **Gallery Management** - Image uploads
✅ **Comments** - Blog post comments
✅ **Newsletter** - Subscription management
✅ **Contact Form** - Message handling
✅ **Analytics** - Page view tracking
✅ **File Uploads** - Local storage
✅ **Security** - Rate limiting, CORS, Helmet

## API Documentation

See `README.md` for full API endpoint documentation.

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using port 3000

### File Upload Issues
- Check `uploads/` directory exists
- Verify file size limits
- Check file permissions

## Next Steps

1. Update frontend to use API (see `js/api.js`)
2. Add admin login page
3. Test all features
4. Deploy to Vercel
5. Configure production database



