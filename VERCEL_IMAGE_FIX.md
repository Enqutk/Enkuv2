# Fix Image Uploads on Vercel

## The Problem
Images uploaded to blog posts aren't showing because:
- Files are saved to `/tmp/uploads/images/` on Vercel (only writable location)
- But the server was trying to serve from `./uploads` (which doesn't exist)
- Files in `/tmp` are temporary and may be deleted

## The Fix
I've updated `server.js` to:
- Serve images from `/tmp/uploads` when on Vercel
- Serve images from `./uploads` in local development

## Important Notes

### ⚠️ Temporary Files on Vercel
Files in `/tmp` are **temporary** and may be deleted when:
- The serverless function times out
- A new deployment happens
- The function instance is recycled

### ✅ Recommended Solutions for Production

**Option 1: Use Image URLs (Easiest)**
- Instead of uploading files, use image URLs
- Host images on:
  - GitHub (via jsDelivr CDN)
  - Imgur
  - Cloudinary (free tier available)
  - Any image hosting service

**Option 2: Use Cloud Storage**
- **Vercel Blob Storage** (recommended for Vercel)
- **AWS S3**
- **Cloudinary**
- **ImgBB**

**Option 3: Store Images in Database**
- Convert images to base64
- Store in database (not recommended for large images)

## Current Status
✅ Images should now work temporarily
⚠️ Files may disappear after function restart
💡 Use image URLs or cloud storage for production

## How to Use Image URLs

In the admin panel:
1. Instead of uploading a file, paste an image URL
2. Use the "Image URL" field
3. The image will be saved and displayed correctly

Example image URLs:
- `https://images.unsplash.com/photo-...`
- `https://via.placeholder.com/800x400`
- Any publicly accessible image URL
