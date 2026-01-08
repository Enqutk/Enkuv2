# GitHub Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `portfolio-v1` (or `portfolio v1` - GitHub will handle the space)
3. Description: "Professional portfolio website with admin panel - Portfolio v1"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, run these commands:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/portfolio-v1.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/portfolio-v1.git

# Push to GitHub
git push -u origin main
```

## Alternative: If you want to use "portfolio v1" with a space

GitHub will automatically convert spaces to hyphens in URLs, but you can use either:
- Repository name: `portfolio-v1` (recommended for URLs)
- Or: `portfolio v1` (GitHub will handle it)

## Quick Command (after creating repo):

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio-v1.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

