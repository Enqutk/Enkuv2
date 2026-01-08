# Login Troubleshooting Guide

## Common Login Issues and Solutions

### 1. "Cannot connect to server" Error

**Problem:** Backend server is not running.

**Solution:**
```bash
# Make sure you're in the project directory
cd /path/to/your/project

# Install dependencies (if not done)
npm install

# Start the backend server
npm run dev
# or
npm start
```

Check that server is running on `http://localhost:3000`

### 2. "Invalid credentials" Error

**Possible causes:**
- Wrong email or password
- Database not set up
- Admin user not created

**Solution:**

1. **Check if database is set up:**
```bash
npm run setup-db
```

2. **Verify your credentials in `.env` file:**
```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

3. **Check MySQL is running:**
```bash
# Windows
net start mysql

# Mac/Linux
sudo service mysql start
# or
brew services start mysql
```

4. **Verify database connection:**
- Check `.env` has correct MySQL credentials
- Test connection manually if needed

### 3. CORS Error

**Problem:** Browser blocking requests due to CORS policy.

**Solution:**
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Or set `FRONTEND_URL=*` for development (not recommended for production)

### 4. Database Connection Error

**Problem:** Cannot connect to MySQL database.

**Check:**
1. MySQL is installed and running
2. `.env` file has correct credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=enku_portfolio
   DB_PORT=3306
   ```

**Solution:**
- Verify MySQL credentials
- Create database manually if needed:
  ```sql
  CREATE DATABASE enku_portfolio;
  ```
- Run setup script: `npm run setup-db`

### 5. "Admin access required" Error

**Problem:** User exists but is not an admin.

**Solution:**
- Make sure you're using the admin email from `.env`
- Check database:
  ```sql
  SELECT email, role FROM users WHERE email = 'your_email@example.com';
  ```
- Should show `role = 'admin'`

### 6. Port Already in Use

**Problem:** Port 3000 is already in use.

**Solution:**
- Change port in `.env`:
  ```env
  PORT=3001
  ```
- Update `js/api.js`:
  ```javascript
  const API_BASE_URL = 'http://localhost:3001/api';
  ```

## Step-by-Step Debugging

### Step 1: Check Backend is Running

Open browser and visit: `http://localhost:3000/api/health`

Should return: `{"status":"ok","timestamp":"..."}`

If not:
- Start backend: `npm run dev`
- Check for errors in terminal

### Step 2: Check Database

```bash
# Run setup script
npm run setup-db
```

Should show: `✅ Database setup completed successfully!`

### Step 3: Test Login Endpoint

Use browser console or Postman:
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Step 4: Check Browser Console

Open browser DevTools (F12) → Console tab
- Look for error messages
- Check network tab for failed requests

### Step 5: Verify Environment Variables

Make sure `.env` file exists and has:
- Database credentials
- JWT_SECRET
- ADMIN_EMAIL and ADMIN_PASSWORD

## Quick Fix Checklist

- [ ] Backend server is running (`npm run dev`)
- [ ] MySQL is running
- [ ] Database is set up (`npm run setup-db`)
- [ ] `.env` file exists and is configured
- [ ] Using correct email/password from `.env`
- [ ] No CORS errors in browser console
- [ ] API URL in `js/api.js` matches backend port

## Still Having Issues?

1. **Check server logs** - Look at terminal where backend is running
2. **Check browser console** - F12 → Console tab
3. **Check network requests** - F12 → Network tab
4. **Verify database** - Check MySQL directly
5. **Test API directly** - Use Postman or curl

## Test Commands

```bash
# Test database connection
node -e "require('dotenv').config(); const pool = require('./config/database'); pool.query('SELECT 1').then(() => console.log('DB OK')).catch(console.error);"

# Test server
curl http://localhost:3000/api/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```





