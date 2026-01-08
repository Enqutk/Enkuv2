const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'enku_portfolio',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Add SSL configuration for PlanetScale (or other cloud databases)
if (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('psdb.cloud')) {
  poolConfig.ssl = {
    rejectUnauthorized: true
  };
}

const pool = mysql.createPool(poolConfig);

// Test connection (non-blocking - won't crash app)
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    console.error('   Make sure:');
    console.error('   1. MySQL is running');
    console.error('   2. .env file has correct DB credentials');
    console.error('   3. Database exists (run: npm run setup-db)');
    // Don't crash - let routes handle DB errors
  });

module.exports = pool;

