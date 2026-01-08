// Vercel serverless function to serve CSS
// This ensures CSS is always available even if static file serving fails

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const cssPath = path.join(__dirname, '..', 'style.css');
  
  // Check if file exists
  if (!fs.existsSync(cssPath)) {
    return res.status(404).send('CSS file not found');
  }
  
  // Read and serve CSS
  const css = fs.readFileSync(cssPath, 'utf8');
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(css);
};
