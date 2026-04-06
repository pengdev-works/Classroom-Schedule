const path = require('path');
const fs = require('fs');

console.log('--- Startup Diagnostics ---');
console.log('Current Workdir:', process.cwd());
console.log('__dirname:', __dirname);

const backendPath = path.join(__dirname, 'backend');
const serverPath = path.join(backendPath, 'server.js');

console.log('Checking for backend directory:', fs.existsSync(backendPath));
console.log('Checking for server.js in backend:', fs.existsSync(serverPath));

if (!fs.existsSync(serverPath)) {
  console.error('CRITICAL: backend/server.js not found!');
  process.exit(1);
}

try {
  console.log('Attempting to launch backend...');
  // Instead of chdir, we use the absolute path for require
  // and manually load dotenv from the backend if it exists
  const dotenv = require('dotenv');
  const envPath = path.join(backendPath, '.env');
  if (fs.existsSync(envPath)) {
    console.log('Found local .env, loading...');
    dotenv.config({ path: envPath });
  } else {
    console.log('Exiting .env check: File not found (expected for production)');
  }

  // Load the backend server
  require(serverPath);
  console.log('Backend server module loaded.');
} catch (error) {
  console.error('FATAL ERROR DURING STARTUP:');
  console.error(error.stack || error);
  process.exit(1);
}
