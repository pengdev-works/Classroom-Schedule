const { query } = require('./db');

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Users table
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT CHECK (role IN ('admin', 'teacher', 'student')) NOT NULL,
                full_name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Rooms table
        await query(`
            CREATE TABLE IF NOT EXISTS rooms (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                capacity INT NOT NULL,
                building TEXT NOT NULL,
                room_number TEXT NOT NULL UNIQUE
            )
        `);

        // Faculty table
        await query(`
            CREATE TABLE IF NOT EXISTS faculty (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                department TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            )
        `);

        // Subjects table
        await query(`
            CREATE TABLE IF NOT EXISTS subjects (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                code TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                units INT NOT NULL
            )
        `);

        // Sections table
        await query(`
            CREATE TABLE IF NOT EXISTS sections (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT UNIQUE NOT NULL,
                academic_program TEXT NOT NULL
            )
        `);

        // Schedules table
        await query(`
            CREATE TABLE IF NOT EXISTS schedules (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
                faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE,
                subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
                section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
                day_of_week TEXT NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
