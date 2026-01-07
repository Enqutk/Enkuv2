# Quick Start Guide - Fix App Crash

## Step 1: Install Dependencies

```bash
npm install
```

Wait for all packages to install.

## Step 2: Check Setup

```bash
npm run check
```

This will show what's missing.

## Step 3: Create .env File

```bash
# Copy the example
cp env.example .env

# Or on Windows:
copy env.example .env
```

Then edit `.env` and set:
- `DB_PASSWORD` - Your MySQL password
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD` - Your admin password

## Step 4: Make Sure MySQL is Running

**Windows:**
```bash
net start mysql
```

**Mac:**
```bash
brew services start mysql
# or
sudo service mysql start
```

**Linux:**
```bash
sudo service mysql start
```

## Step 5: Setup Database

```bash
npm run setup-db
```

This creates:
- Database
- Tables
- Admin user

## Step 6: Start Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
✅ MySQL Database connected successfully
```

## Common Crash Causes

### 1. Missing .env file
**Fix:** Create `.env` from `env.example`

### 2. MySQL not running
**Fix:** Start MySQL service

### 3. Wrong MySQL password
**Fix:** Update `DB_PASSWORD` in `.env`

### 4. Port already in use
**Fix:** Change `PORT=3001` in `.env` or kill process on port 3000

### 5. Missing dependencies
**Fix:** Run `npm install`

### 6. Missing route files
**Fix:** Make sure all files in `routes/` folder exist

## Test Server

Open browser: `http://localhost:3000/api/health`

Should return: `{"status":"ok"}`

## Still Crashing?

1. **Check terminal output** - Look for error messages
2. **Run check:** `npm run check`
3. **Check MySQL:** Make sure it's running
4. **Check .env:** Make sure it exists and has correct values

## Error Messages Guide

- **"Cannot find module"** → Run `npm install`
- **"Access denied for user"** → Wrong MySQL password in `.env`
- **"ECONNREFUSED"** → MySQL not running
- **"EADDRINUSE"** → Port already in use
- **"Cannot find .env"** → Create `.env` file



