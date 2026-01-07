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
app.use(helmet());
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (with error handling)
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/blog', require('./routes/blog'));
  app.use('/api/gallery', require('./routes/gallery'));
  app.use('/api/comments', require('./routes/comments'));
  app.use('/api/newsletter', require('./routes/newsletter'));
  app.use('/api/contact', require('./routes/contact'));
  app.use('/api/analytics', require('./routes/analytics'));
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

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

module.exports = app;

