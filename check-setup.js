// Quick setup checker
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking setup...\n');

// Check .env file
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found');
  console.log('   Run: cp env.example .env');
  console.log('   Then edit .env with your settings\n');
} else {
  console.log('✅ .env file exists');
}

// Check node_modules
if (!fs.existsSync('node_modules')) {
  console.log('❌ node_modules not found');
  console.log('   Run: npm install\n');
} else {
  console.log('✅ Dependencies installed');
}

// Check route files
const routes = [
  'routes/auth.js',
  'routes/blog.js',
  'routes/gallery.js',
  'routes/comments.js',
  'routes/newsletter.js',
  'routes/contact.js',
  'routes/analytics.js'
];

let allRoutesExist = true;
routes.forEach(route => {
  if (!fs.existsSync(route)) {
    console.log(`❌ Missing: ${route}`);
    allRoutesExist = false;
  }
});

if (allRoutesExist) {
  console.log('✅ All route files exist');
}

// Check config files
const configs = ['config/database.js', 'middleware/auth.js', 'middleware/upload.js'];
let allConfigsExist = true;
configs.forEach(config => {
  if (!fs.existsSync(config)) {
    console.log(`❌ Missing: ${config}`);
    allConfigsExist = false;
  }
});

if (allConfigsExist) {
  console.log('✅ All config files exist');
}

// Check uploads directory
const uploadsDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadsDir)) {
  console.log(`⚠️  Uploads directory doesn't exist (will be created automatically)`);
} else {
  console.log('✅ Uploads directory exists');
}

console.log('\n📋 Setup Checklist:');
console.log('   [ ] .env file created and configured');
console.log('   [ ] npm install completed');
console.log('   [ ] MySQL is running');
console.log('   [ ] npm run setup-db completed');
console.log('   [ ] npm run dev to start server\n');



