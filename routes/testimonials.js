const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get testimonials (public - only approved)
router.get('/', async (req, res) => {
  try {
    const approved = req.query.approved !== 'false'; // Default to true
    let query = 'SELECT * FROM testimonials';
    const params = [];
    
    if (approved) {
      query += ' WHERE approved = TRUE';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [testimonials] = await pool.query(query, params);
    res.json({ testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all testimonials (admin - including unapproved)
router.get('/all', authenticate, isAdmin, async (req, res) => {
  try {
    const [testimonials] = await pool.query(
      'SELECT * FROM testimonials ORDER BY approved ASC, created_at DESC'
    );
    res.json({ testimonials });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create testimonial (public)
router.post('/', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('quote').notEmpty().trim(),
  body('rating').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, role, quote, rating, avatar } = req.body;
    const approved = false; // New testimonials need admin approval

    const [result] = await pool.query(
      `INSERT INTO testimonials (name, email, role, quote, rating, avatar, approved) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, role || 'Client', quote, rating || 5, avatar || null, approved]
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed before being published.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update testimonial (admin)
router.put('/:id', authenticate, isAdmin, [
  body('name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('quote').optional().notEmpty().trim(),
  body('rating').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, role, quote, rating, avatar } = req.body;

    // Get existing testimonial
    const [existing] = await pool.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Update only provided fields
    await pool.query(
      `UPDATE testimonials 
       SET name = ?, email = ?, role = ?, quote = ?, rating = ?, avatar = ?
       WHERE id = ?`,
      [
        name || existing[0].name,
        email || existing[0].email,
        role !== undefined ? role : existing[0].role,
        quote || existing[0].quote,
        rating || existing[0].rating,
        avatar !== undefined ? avatar : existing[0].avatar,
        id
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve testimonial (admin)
router.patch('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'UPDATE testimonials SET approved = TRUE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ success: true, message: 'Testimonial approved' });
  } catch (error) {
    console.error('Approve testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete testimonial (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'DELETE FROM testimonials WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

