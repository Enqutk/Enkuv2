// Vercel serverless function to serve CSS
// This ensures CSS is always available even if static file serving fails

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(process.cwd(), 'style.css'),
      path.join(__dirname, '..', 'style.css'),
      path.join(__dirname, '../style.css'),
      './style.css'
    ];
    
    let cssPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        cssPath = p;
        break;
      }
    }
    
    if (!cssPath) {
      console.error('CSS file not found. Tried:', possiblePaths);
      return res.status(404).send('/* CSS file not found */');
    }
    
    // Read and serve CSS
    const css = fs.readFileSync(cssPath, 'utf8');
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(css);
  } catch (error) {
    console.error('Error serving CSS:', error);
    res.status(500).send('/* Error loading CSS */');
  }
};
