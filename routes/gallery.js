const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all gallery items (public)
router.get('/', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    let query = 'SELECT * FROM gallery_items ORDER BY created_at DESC';
    const params = [];

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [items] = await pool.query(query, params);
    res.json(items);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [items] = await pool.query(
      'SELECT * FROM gallery_items WHERE id = ?',
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(items[0]);
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create gallery item (admin only)
router.post('/', 
  authenticate, 
  isAdmin,
  upload.single('image'),
  [
    body('title').notEmpty().trim(),
    body('image').if(body('image').isEmpty()).custom(() => {
      throw new Error('Image is required');
    })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, category } = req.body;
      let imageUrl = req.body.image; // From URL input

      // If file uploaded, use file path
      if (req.file) {
        imageUrl = `/uploads/images/${req.file.filename}`;
      }

      if (!imageUrl) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const [result] = await pool.query(
        `INSERT INTO gallery_items (title, description, image, category) 
         VALUES (?, ?, ?, ?)`,
        [title, description || null, imageUrl, category || null]
      );

      const [newItem] = await pool.query(
        'SELECT * FROM gallery_items WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json(newItem[0]);
    } catch (error) {
      console.error('Create gallery item error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update gallery item (admin only)
router.put('/:id', 
  authenticate, 
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category } = req.body;

      const [existing] = await pool.query(
        'SELECT * FROM gallery_items WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      let imageUrl = existing[0].image;
      if (req.file) {
        imageUrl = `/uploads/images/${req.file.filename}`;
      } else if (req.body.image) {
        imageUrl = req.body.image;
      }

      await pool.query(
        `UPDATE gallery_items 
         SET title = ?, description = ?, image = ?, category = ?
         WHERE id = ?`,
        [title || existing[0].title, description || existing[0].description,
         imageUrl, category || existing[0].category, id]
      );

      const [updated] = await pool.query(
        'SELECT * FROM gallery_items WHERE id = ?',
        [id]
      );

      res.json(updated[0]);
    } catch (error) {
      console.error('Update gallery item error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete gallery item (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM gallery_items WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;





