const { query } = require('./db');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
    try {
        console.log('Setting up initial admin...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password',
            ['admin', hashedPassword, 'admin']
        );
        console.log('Initial admin created (username: admin, password: admin123)');
        process.exit(0);
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
};

setupAdmin();
