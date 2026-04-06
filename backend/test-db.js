const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const testConnection = async () => {
    try {
        console.log('--- DB Connection Diagnostics ---');
        console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1] || 'Unknown Host');
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connection Successful:', res.rows[0].now);
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('--- Diagnostics End ---');
        process.exit(1);
    }
};

testConnection();
