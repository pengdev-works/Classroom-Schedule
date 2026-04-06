const path = require('path');

// Change working directory to the backend folder
// This ensures that relative requires and .env loading inside the backend work correctly
process.chdir(path.join(__dirname, 'backend'));

// Start the real server
require('./server.js');
