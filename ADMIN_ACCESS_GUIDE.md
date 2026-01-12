# Admin Access Guide

## How to Access the Admin Panel

### Step 1: Make Sure Backend Server is Running

**For Local Development:**
```bash
# Make sure you're in the project directory
cd "C:\Users\Hp\Downloads\Telegram Desktop\Enku_Taddesse_1508"

# Start the backend server
npm run dev
```

The server should run on `http://localhost:3002` (or check your `.env` file for the PORT)

### Step 2: Access Admin Login Page

**Option A: Direct URL**
- Open your browser and go to: `http://localhost:5500/admin-login.html`
- Or if using the server: `http://localhost:3002/admin-login.html`

**Option B: From Homepage**
- Go to your homepage: `http://localhost:5500/index.html`
- Look for the "Admin Panel" button in the navigation (it may be hidden until you're logged in)

### Step 3: Login Credentials

**Default Credentials (if you haven't changed them):**
- **Email:** `admin@example.com`
- **Password:** `admin123`

**To Change Credentials:**

1. Edit your `.env` file:
```env
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=your_secure_password
```

2. Run the database setup to create/update the admin user:
```bash
npm run setup-db
```

### Step 4: Access Admin Panel

After successful login, you'll be redirected to `admin.html` where you can:
- ✅ Add, edit, and delete blog posts
- ✅ Add, edit, and delete gallery items
- ✅ Add, edit, and delete projects
- ✅ Manage testimonials
- ✅ Upload images

## For Vercel (Hosted Site)

If your site is hosted on Vercel:

1. **Make sure backend is accessible:**
   - Your backend API should be accessible at `https://your-site.vercel.app/api`
   - Or you need a separate backend server (Railway, Render, etc.)

2. **Access admin login:**
   - Go to: `https://your-site.vercel.app/admin-login.html`

3. **Use your admin credentials:**
   - The same credentials from your `.env` file (if backend is on Railway/Render)
   - Or the default credentials if using development mode

## Troubleshooting

### "Cannot connect to server" Error

**Problem:** Backend server is not running.

**Solution:**
1. Make sure the backend server is running (`npm run dev`)
2. Check the port in `.env` file (should match `js/api.js` - currently 3002)
3. Verify the API URL in `js/api.js` matches your backend URL

### "Invalid credentials" Error

**Problem:** Wrong email/password or admin user doesn't exist.

**Solution:**
1. Check your `.env` file for `ADMIN_EMAIL` and `ADMIN_PASSWORD`
2. Run `npm run setup-db` to create the admin user
3. Make sure database is connected (check `.env` DB credentials)

### Database Connection Error

**Problem:** Cannot connect to MySQL database.

**Solution:**
1. Check your `.env` file has correct database credentials:
   ```env
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=enku_portfolio
   ```
2. For Railway: Use the public hostname (not `mysql.railway.internal`)
3. Run `npm run setup-db` to initialize the database

## Quick Test

To verify everything is working:

1. **Check backend is running:**
   ```bash
   curl http://localhost:3002/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Test login:**
   - Go to `admin-login.html`
   - Enter credentials
   - Should redirect to `admin.html`

## Admin Panel Features

Once logged in, you can:

### Blog Posts Tab
- Create new blog posts
- Edit existing posts
- Delete posts
- Mark posts as "Featured"
- Upload images for posts

### Gallery Tab
- Add gallery items
- Edit gallery items
- Delete gallery items
- Upload images

### Projects Tab
- Add new projects
- Edit projects
- Delete projects
- Set projects as "Featured"
- Upload project images

### Testimonials Tab
- View submitted testimonials
- Approve/reject testimonials
- Delete testimonials

## Security Notes

⚠️ **Important:**
- Change default admin credentials in production
- Use strong passwords
- Keep your `.env` file secure (never commit it to Git)
- Use HTTPS in production
- Consider adding rate limiting for login attempts
