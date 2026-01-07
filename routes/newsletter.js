const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');

// Subscribe to newsletter (public)
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail(),
  body('name').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name } = req.body;

    // Check if already subscribed
    const [existing] = await pool.query(
      'SELECT id FROM newsletter_subscribers WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      // Update if exists
      await pool.query(
        'UPDATE newsletter_subscribers SET subscribed = TRUE, name = COALESCE(?, name) WHERE email = ?',
        [name, email]
      );
      return res.json({ message: 'Subscription updated successfully' });
    }

    // Create new subscription
    await pool.query(
      'INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)',
      [email, name || null]
    );

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unsubscribe (public)
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    await pool.query(
      'UPDATE newsletter_subscribers SET subscribed = FALSE WHERE email = ?',
      [email]
    );

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', authenticate, isAdmin, async (req, res) => {
  try {
    const { subscribed } = req.query;
    let query = 'SELECT * FROM newsletter_subscribers';
    const params = [];

    if (subscribed !== undefined) {
      query += ' WHERE subscribed = ?';
      params.push(subscribed === 'true');
    }

    query += ' ORDER BY created_at DESC';

    const [subscribers] = await pool.query(query, params);
    res.json(subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



