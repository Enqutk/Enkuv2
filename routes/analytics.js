const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');

// Track page view (public)
router.post('/track', async (req, res) => {
  try {
    const { page } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    const referrer = req.get('referer');

    await pool.query(
      'INSERT INTO analytics (page, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)',
      [page || 'unknown', ip, userAgent, referrer || null]
    );

    res.json({ message: 'Tracked successfully' });
  } catch (error) {
    console.error('Analytics track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { page, startDate, endDate, limit } = req.query;
    let query = 'SELECT * FROM analytics WHERE 1=1';
    const params = [];

    if (page) {
      query += ' AND page = ?';
      params.push(page);
    }

    if (startDate) {
      query += ' AND created_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND created_at <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [analytics] = await pool.query(query, params);
    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics stats (admin only)
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = '';
    const params = [];

    if (startDate && endDate) {
      dateFilter = 'WHERE created_at BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Total views
    const [totalViews] = await pool.query(
      `SELECT COUNT(*) as count FROM analytics ${dateFilter}`,
      params
    );

    // Views by page
    const [viewsByPage] = await pool.query(
      `SELECT page, COUNT(*) as count 
       FROM analytics ${dateFilter}
       GROUP BY page 
       ORDER BY count DESC`,
      params
    );

    // Unique visitors (by IP)
    const [uniqueVisitors] = await pool.query(
      `SELECT COUNT(DISTINCT ip_address) as count 
       FROM analytics ${dateFilter}`,
      params
    );

    res.json({
      totalViews: totalViews[0].count,
      uniqueVisitors: uniqueVisitors[0].count,
      viewsByPage: viewsByPage
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



