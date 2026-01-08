const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('📦 Creating database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'enku_portfolio'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'enku_portfolio'}`);

    // Create tables
    console.log('📋 Creating tables...');

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Blog posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        image VARCHAR(500),
        category VARCHAR(100),
        featured BOOLEAN DEFAULT FALSE,
        author_id INT,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_featured (featured),
        INDEX idx_created (created_at)
      )
    `);

    // Gallery items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        image VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created (created_at)
      )
    `);

    // Comments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blog_post_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
        INDEX idx_blog_post (blog_post_id),
        INDEX idx_approved (approved)
      )
    `);

    // Newsletter subscribers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        subscribed BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    // Contact messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        \`read\` BOOLEAN DEFAULT FALSE,
        replied BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_read (\`read\`),
        INDEX idx_created (created_at)
      )
    `);

    // Analytics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_page (page),
        INDEX idx_created (created_at)
      )
    `);

    // Testimonials table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(255) DEFAULT 'Client',
        quote TEXT NOT NULL,
        rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
        avatar VARCHAR(500),
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_approved (approved),
        INDEX idx_created (created_at)
      )
    `);

    // Projects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        year VARCHAR(10) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500),
        tags JSON,
        collab ENUM('team', 'solo') DEFAULT 'solo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_year (year),
        INDEX idx_collab (collab),
        INDEX idx_created (created_at)
      )
    `);

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existingAdmin.length === 0) {
      await connection.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [adminEmail, hashedPassword, 'admin']
      );
      console.log('✅ Admin user created:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();


