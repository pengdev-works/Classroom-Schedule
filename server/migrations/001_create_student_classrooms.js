import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  try {
    console.log("🔄 Creating student_classrooms table...");

    // Create student_classrooms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_classrooms (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        classroom_id INTEGER NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, classroom_id)
      )
    `);

    console.log("✅ student_classrooms table created successfully!");

    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_student_classrooms_student_id 
      ON student_classrooms(student_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_student_classrooms_classroom_id 
      ON student_classrooms(classroom_id)
    `);

    console.log("✅ Indexes created successfully!");

    await pool.end();
    console.log("✅ Migration completed!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
