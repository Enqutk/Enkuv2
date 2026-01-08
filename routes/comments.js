const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get comments for a blog post (public)
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const [comments] = await pool.query(
      `SELECT * FROM comments 
       WHERE blog_post_id = ? AND approved = TRUE 
       ORDER BY created_at DESC`,
      [postId]
    );
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create comment (public)
router.post('/', [
  body('blog_post_id').isInt(),
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('content').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { blog_post_id, name, email, content } = req.body;

    // Check if post exists
    const [posts] = await pool.query(
      'SELECT id FROM blog_posts WHERE id = ?',
      [blog_post_id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const [result] = await pool.query(
      `INSERT INTO comments (blog_post_id, name, email, content) 
       VALUES (?, ?, ?, ?)`,
      [blog_post_id, name, email, content]
    );

    const [newComment] = await pool.query(
      'SELECT * FROM comments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all comments (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { approved } = req.query;
    let query = `
      SELECT c.*, bp.title as post_title 
      FROM comments c
      LEFT JOIN blog_posts bp ON c.blog_post_id = bp.id
    `;
    const params = [];

    if (approved !== undefined) {
      query += ' WHERE c.approved = ?';
      params.push(approved === 'true');
    }

    query += ' ORDER BY c.created_at DESC';

    const [comments] = await pool.query(query, params);
    res.json(comments);
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve/Unapprove comment (admin only)
router.patch('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    await pool.query(
      'UPDATE comments SET approved = ? WHERE id = ?',
      [approved === true, id]
    );

    res.json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Approve comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;





