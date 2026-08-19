const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables
if (!fs.existsSync('.env')) {
  console.warn('⚠️  Warning: .env file not found. Using defaults.');
  console.warn('   Create a .env file from env.example');
}

require('dotenv').config();

const app = express();

// Better error handling for startup
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline scripts for theme toggle
        "'unsafe-eval'", // Allow eval for some libraries
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers (onclick)
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline styles
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
// On Vercel, serve from /tmp, otherwise from ./uploads
if (process.env.VERCEL || process.env.VERCEL_ENV) {
  // On Vercel, serve files from /tmp/uploads
  app.use('/uploads', express.static('/tmp/uploads'));
} else {
  // Local development, serve from ./uploads
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Clean URLs: /projects instead of /projects.html
const PAGE_FILES = {
  '/': 'index.html',
  '/about': 'about.html',
  '/projects': 'projects.html',
  '/blog': 'blog.html',
  '/gallery': 'gallery.html',
  '/admin': 'admin.html',
  '/admin-login': 'admin-login.html',
  '/login': 'admin-login.html'
};

const HTML_REDIRECTS = {
  '/index.html': '/',
  '/about.html': '/about',
  '/projects.html': '/projects',
  '/blog.html': '/blog',
  '/gallery.html': '/gallery',
  '/admin.html': '/admin',
  '/admin-login.html': '/admin-login'
};

app.use((req, res, next) => {
  const pathname = req.path.replace(/\/+$/, '') || '/';
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

  if (HTML_REDIRECTS[req.path] || HTML_REDIRECTS[pathname]) {
    const dest = HTML_REDIRECTS[req.path] || HTML_REDIRECTS[pathname];
    return res.redirect(301, dest + query);
  }

  if (req.path !== '/' && req.path.endsWith('/')) {
    return res.redirect(301, pathname + query);
  }

  next();
});

// Explicit CSS route with file existence check
app.get('/style.css', (req, res) => {
  const cssPath = path.join(__dirname, 'style.css');
  const fs = require('fs');
  
  // Check if file exists
  if (!fs.existsSync(cssPath)) {
    console.error('CSS file not found at:', cssPath);
    console.error('Current directory:', __dirname);
    console.error('Files in directory:', fs.readdirSync(__dirname).slice(0, 10));
    return res.status(404).send('/* CSS file not found */');
  }
  
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(cssPath);
});

// Serve static files FIRST (CSS, JS, images) - before API routes
app.use(express.static(path.join(__dirname), {
  dotfiles: 'ignore',
  index: false,
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    // Set proper content type for CSS
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

// Explicit clean page routes (in case static miss)
Object.keys(PAGE_FILES).forEach((route) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, PAGE_FILES[route]));
  });
});

// Routes (with error handling) - MUST come after static files for API routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/blog', require('./routes/blog'));
  app.use('/api/gallery', require('./routes/gallery'));
  app.use('/api/projects', require('./routes/projects'));
  app.use('/api/comments', require('./routes/comments'));
  app.use('/api/newsletter', require('./routes/newsletter'));
  app.use('/api/contact', require('./routes/contact'));
  app.use('/api/analytics', require('./routes/analytics'));
  app.use('/api/testimonials', require('./routes/testimonials'));
} catch (error) {
  console.error('❌ Error loading routes:', error);
  console.error('Make sure all route files exist');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// For non-API routes, serve index.html (SPA fallback)
app.get('*', (req, res) => {
  // Don't serve HTML for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  // Static files should already be served by express.static above
  // If we reach here for a static file, it doesn't exist
  if (req.path.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|pdf|woff|woff2|ttf|eot|json)$/)) {
    return res.status(404).send('File not found');
  }
  // Serve index.html for all other routes (SPA fallback)
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Only start server if not on Vercel (serverless)
// On Vercel, the serverless function will handle requests
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  const PORT = process.env.PORT || 3000;
  
  // Start server with error handling
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
      console.log(`\n✅ Server started successfully!`);
      console.log(`\n📋 Next steps:`);
      console.log(`   1. Make sure MySQL is running`);
      console.log(`   2. Run: npm run setup-db`);
      console.log(`   3. Test: http://localhost:${PORT}/api/health\n`);
    }).on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error(`   Change PORT in .env or kill the process using port ${PORT}`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
} else {
  // On Vercel, just log that we're in serverless mode
  console.log('🌐 Running on Vercel (serverless mode)');
}

// Export app for both local and Vercel
module.exports = app;

