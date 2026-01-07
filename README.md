# Enku Taddesse Portfolio - Professional Backend

A professional portfolio website backend built with Node.js, Express, and MySQL.

## Features

- ✅ **Authentication** - Email/password login with JWT
- ✅ **Blog Management** - Create, read, update, delete blog posts
- ✅ **Gallery Management** - Manage gallery items with image uploads
- ✅ **Comments System** - Blog post comments with moderation
- ✅ **Newsletter** - Subscription management
- ✅ **Contact Form** - Contact message handling with email notifications
- ✅ **Analytics** - Page view tracking and statistics
- ✅ **File Uploads** - Local file storage for images
- ✅ **Security** - Helmet, CORS, rate limiting

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your:
- MySQL database credentials
- JWT secret
- Email configuration (optional)
- Admin credentials

### 3. Setup MySQL Database

Make sure MySQL is running, then:

```bash
npm run setup-db
```

This will:
- Create the database
- Create all tables
- Create admin user (from `.env`)

### 4. Start Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (optional)
- `GET /api/auth/me` - Get current user

### Blog
- `GET /api/blog` - Get all posts
- `GET /api/blog/:id` - Get single post
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)
- `DELETE /api/blog/:id` - Delete post (admin)

### Gallery
- `GET /api/gallery` - Get all items
- `GET /api/gallery/:id` - Get single item
- `POST /api/gallery` - Create item (admin)
- `PUT /api/gallery/:id` - Update item (admin)
- `DELETE /api/gallery/:id` - Delete item (admin)

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment
- `GET /api/comments` - Get all comments (admin)
- `PATCH /api/comments/:id/approve` - Approve comment (admin)
- `DELETE /api/comments/:id` - Delete comment (admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `GET /api/newsletter/subscribers` - Get subscribers (admin)

### Contact
- `POST /api/contact` - Send message
- `GET /api/contact` - Get messages (admin)
- `PATCH /api/contact/:id/read` - Mark as read (admin)
- `DELETE /api/contact/:id` - Delete message (admin)

### Analytics
- `POST /api/analytics/track` - Track page view
- `GET /api/analytics` - Get analytics (admin)
- `GET /api/analytics/stats` - Get statistics (admin)

## File Upload

Images are stored in `./uploads/images/` directory.

Supported formats: jpg, jpeg, png, gif, webp
Max file size: 5MB (configurable in `.env`)

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

4. For MySQL, use a cloud service like:
   - PlanetScale
   - AWS RDS
   - Railway
   - Clever Cloud

## Database Schema

- `users` - User accounts
- `blog_posts` - Blog posts
- `gallery_items` - Gallery images
- `comments` - Blog comments
- `newsletter_subscribers` - Newsletter list
- `contact_messages` - Contact form submissions
- `analytics` - Page view tracking

## Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Helmet security headers
- CORS protection
- Input validation
- SQL injection protection (parameterized queries)

## License

MIT



