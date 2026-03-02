import { pool } from "../config/db.js";

export const getSchedules = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM schedules ORDER BY day, start_time"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
};

export const createSchedule = async (req, res) => {
  const {
    classroom_id,
    subject,
    teacher,
    day,
    start_time,
    end_time,
  } = req.body;

  try {
    // Conflict detection
    const conflict = await pool.query(
      `SELECT * FROM schedules
       WHERE classroom_id = $1
       AND day = $2
       AND (
         ($3 BETWEEN start_time AND end_time)
         OR
         ($4 BETWEEN start_time AND end_time)
       )`,
      [classroom_id, day, start_time, end_time]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({
        message: "Schedule conflict detected",
      });
    }

    const result = await pool.query(
      `INSERT INTO schedules
       (classroom_id, subject, teacher, day, start_time, end_time)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [classroom_id, subject, teacher, day, start_time, end_time]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create schedule" });
  }
};