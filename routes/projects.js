const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    let query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const params = [];

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [projects] = await pool.query(query, params);
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [projects] = await pool.query(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(projects[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create project (admin only)
router.post('/', 
  authenticate, 
  isAdmin,
  upload.single('image'),
  [
    body('title').notEmpty().trim(),
    body('year').notEmpty().trim(),
    body('desc').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, year, desc, tags, collab } = req.body;
      let imageUrl = req.body.image; // From URL input

      // If file uploaded, use file path
      if (req.file) {
        imageUrl = `/uploads/images/${req.file.filename}`;
      }

      // Parse tags if it's a string
      let tagsArray = [];
      if (tags) {
        if (typeof tags === 'string') {
          tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        } else if (Array.isArray(tags)) {
          tagsArray = tags;
        }
      }

      const [result] = await pool.query(
        `INSERT INTO projects (title, year, description, image, tags, collab) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          title, 
          year, 
          desc, 
          imageUrl || null, 
          JSON.stringify(tagsArray), 
          collab || 'solo'
        ]
      );

      const [newProject] = await pool.query(
        'SELECT * FROM projects WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json(newProject[0]);
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update project (admin only)
router.put('/:id', 
  authenticate, 
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, year, desc, tags, collab } = req.body;

      const [existing] = await pool.query(
        'SELECT * FROM projects WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      let imageUrl = existing[0].image;
      if (req.file) {
        imageUrl = `/uploads/images/${req.file.filename}`;
      } else if (req.body.image) {
        imageUrl = req.body.image;
      }

      // Parse tags if it's a string
      let tagsArray = existing[0].tags ? JSON.parse(existing[0].tags) : [];
      if (tags) {
        if (typeof tags === 'string') {
          tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        } else if (Array.isArray(tags)) {
          tagsArray = tags;
        }
      }

      await pool.query(
        `UPDATE projects 
         SET title = ?, year = ?, description = ?, image = ?, tags = ?, collab = ?
         WHERE id = ?`,
        [
          title || existing[0].title,
          year || existing[0].year,
          desc || existing[0].description,
          imageUrl,
          JSON.stringify(tagsArray),
          collab || existing[0].collab || 'solo',
          id
        ]
      );

      const [updated] = await pool.query(
        'SELECT * FROM projects WHERE id = ?',
        [id]
      );

      res.json(updated[0]);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete project (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM projects WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
