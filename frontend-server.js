const express = require('express');
const path = require('path');

const app = express();
const PORT = 5500;

const PAGE_FILES = {
  '/': 'index.html',
  '/about': 'about.html',
  '/projects': 'projects.html',
  '/blog': 'blog.html',
  '/gallery': 'gallery.html',
  '/admin': 'admin.html',
  '/admin-login': 'admin-login.html',
  '/login': 'admin-login.html'
};

const HTML_REDIRECTS = {
  '/index.html': '/',
  '/about.html': '/about',
  '/projects.html': '/projects',
  '/blog.html': '/blog',
  '/gallery.html': '/gallery',
  '/admin.html': '/admin',
  '/admin-login.html': '/admin-login'
};

app.use((req, res, next) => {
  const pathname = req.path.replace(/\/+$/, '') || '/';
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

  if (HTML_REDIRECTS[req.path] || HTML_REDIRECTS[pathname]) {
    const dest = HTML_REDIRECTS[req.path] || HTML_REDIRECTS[pathname];
    return res.redirect(301, dest + query);
  }

  if (req.path !== '/' && req.path.endsWith('/')) {
    return res.redirect(301, pathname + query);
  }

  next();
});

app.use(express.static(__dirname, {
  index: false,
  extensions: ['html']
}));

Object.keys(PAGE_FILES).forEach((route) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, PAGE_FILES[route]));
  });
});

app.listen(PORT, () => {
  console.log(`\n🌐 Frontend server running on http://localhost:${PORT}`);
  console.log(`🏠 Homepage: http://localhost:${PORT}/`);
  console.log(`📁 Projects: http://localhost:${PORT}/projects`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin-login\n`);
});
