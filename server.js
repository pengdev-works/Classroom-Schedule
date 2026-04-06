const path = require('path');

try {
  // Change working directory to the backend folder
  process.chdir(path.join(__dirname, 'backend'));
  
  // Start the real server
  require('./server.js');
} catch (error) {
  console.error('Failed to start backend server:', error);
  process.exit(1);
}
