const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

// Register (for future use)
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Development fallback if database is not available
    const isDevMode = process.env.NODE_ENV === 'development';
    const devAdminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const devAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    try {
      // Get user from database
      const [users] = await pool.query(
        'SELECT id, email, password, role FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        // In dev mode, allow fallback authentication
        if (isDevMode && email === devAdminEmail && password === devAdminPassword) {
          console.warn('⚠️  Using development fallback authentication (database not available)');
          const token = jwt.sign(
            { userId: 1, email: email, role: 'admin' },
            process.env.JWT_SECRET || 'dev-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
          );
          return res.json({
            token,
            user: {
              id: 1,
              email: email,
              role: 'admin'
            }
          });
        }
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];

      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError) {
      // Database connection error - use dev fallback
      if (isDevMode && email === devAdminEmail && password === devAdminPassword) {
        console.warn('⚠️  Database connection failed, using development fallback authentication');
        console.warn('   Error:', dbError.message);
        console.warn('   To fix: Update DB_PASSWORD in .env and run: npm run setup-db');
        const token = jwt.sign(
          { userId: 1, email: email, role: 'admin' },
          process.env.JWT_SECRET || 'dev-secret-key',
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        return res.json({
          token,
          user: {
            id: 1,
            email: email,
            role: 'admin'
          }
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.code === 'ER_ACCESS_DENIED_ERROR' 
      ? 'Database connection failed. Check your MySQL password in .env file'
      : error.message || 'Server error';
    res.status(500).json({ error: errorMessage });
  }
});

// Get current user
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;


