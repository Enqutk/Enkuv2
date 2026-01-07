const express = require('express');
const path = require('path');

const app = express();
const PORT = 5500;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Start server
app.listen(PORT, () => {
  console.log(`\n🌐 Frontend server running on http://localhost:${PORT}`);
  console.log(`📄 Admin Login: http://localhost:${PORT}/admin-login.html`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`🏠 Homepage: http://localhost:${PORT}/index.html\n`);
});


