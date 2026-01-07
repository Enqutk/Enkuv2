# Portfolio Multi-Page System - Admin Guide

## Overview
Your portfolio has been transformed into a multi-page website with an admin panel for managing blog posts and gallery items.

## Pages Structure

1. **index.html** - Home page with previews from all sections
2. **about.html** - About page with your story, skills, and services
3. **blog.html** - Blog listing and individual blog post pages
4. **gallery.html** - Gallery of images and visual content
5. **admin.html** - Admin panel for managing content

## How to Use the Admin Panel

### Accessing the Admin Panel
1. Open `admin.html` in your browser
2. The admin panel has two tabs: "Blog Posts" and "Gallery"

### Adding a Blog Post
1. Go to the "Blog Posts" tab
2. Fill in the form:
   - **Title**: The blog post title
   - **Excerpt**: Short description (appears on home page preview)
   - **Content**: Full blog post content
   - **Image URL**: Link to an image (optional)
   - **Category**: Category tag (optional)
   - **Feature this post**: Check this to pin it at the top
3. Click "Publish Blog Post"
4. The post will appear on:
   - Home page (in the "Latest Blog Posts" section)
   - Blog page (featured posts appear first)

### Adding a Gallery Item
1. Go to the "Gallery" tab
2. Fill in the form:
   - **Title**: Item title
   - **Description**: Optional description
   - **Image URL**: Required image link
   - **Category**: Category tag (optional)
3. Click "Add to Gallery"
4. The item will appear on:
   - Home page (in the "Gallery" preview section)
   - Gallery page

### Featured Posts
- When you check "Feature this post", it will:
  - Appear at the top of the blog list
  - Show a "Featured" badge
  - Be highlighted on the home page

### Managing Content
- View all your posts/items in the "Existing" sections
- Delete items using the "Delete" button
- Content is stored in browser localStorage (persists between sessions)

## Data Storage
- All data is stored in browser localStorage
- No backend server required
- Data persists as long as you don't clear browser data
- To backup: Open browser console and run: `localStorage.getItem('blogs')` and `localStorage.getItem('gallery')`

## Navigation
- All pages have consistent navigation
- Home page shows previews from blog and gallery
- Clicking on previews takes you to full pages

## Tips
- Use image URLs from services like Imgur, Cloudinary, or your own hosting
- Featured posts are great for highlighting important announcements
- Keep excerpts short (150 characters) for better home page display
- Categories help organize content

