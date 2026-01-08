const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all blog posts (public)
router.get('/', async (req, res) => {
  try {
    const { featured, limit, offset } = req.query;
    let query = 'SELECT * FROM blog_posts';
    const params = [];

    if (featured === 'true') {
      query += ' WHERE featured = TRUE';
    }

    query += ' ORDER BY featured DESC, created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [posts] = await pool.query(query, params);
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get post
    const [posts] = await pool.query(
      'SELECT * FROM blog_posts WHERE id = ?',
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    await pool.query(
      'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
      [id]
    );

    res.json(posts[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create blog post (admin only)
router.post('/', 
  authenticate, 
  isAdmin,
  upload.single('image'),
  [
    body('title').notEmpty().trim(),
    body('content').notEmpty(),
    body('excerpt').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, excerpt, category, featured } = req.body;
      let imageUrl = req.body.image; // From URL input

      // If file uploaded, use file path
      if (req.file) {
        imageUrl = `/uploads/images/${req.file.filename}`;
      }

      const [result] = await pool.query(
        `INSERT INTO blog_posts (title, content, excerpt, image, category, featured, author_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, content, excerpt || content.substring(0, 150) + '...', imageUrl, category || null, featured === 'true', req.user.id]
      );

      const [newPost] = await pool.query(
        'SELECT * FROM blog_posts WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json(newPost[0]);
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update blog post (admin only)
router.put('/:id', 
  authenticate, 
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, excerpt, category, featured } = req.body;

      // Get existing post
      const [existing] = await pool.query(
        'SELECT * FROM blog_posts WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      let imageUrl = existing[0].image;
      if (req.file) {
        imageUrl = `/uploads/images/${req.file.filename}`;
      } else if (req.body.image) {
        imageUrl = req.body.image;
      }

      await pool.query(
        `UPDATE blog_posts 
         SET title = ?, content = ?, excerpt = ?, image = ?, category = ?, featured = ?
         WHERE id = ?`,
        [title || existing[0].title, content || existing[0].content, 
         excerpt || existing[0].excerpt, imageUrl, category || existing[0].category,
         featured !== undefined ? featured === 'true' : existing[0].featured, id]
      );

      const [updated] = await pool.query(
        'SELECT * FROM blog_posts WHERE id = ?',
        [id]
      );

      res.json(updated[0]);
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete blog post (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM blog_posts WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;





