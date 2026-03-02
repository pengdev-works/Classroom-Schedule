import { pool } from "../config/db.js";

export const getClassrooms = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM classrooms ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch classrooms" });
  }
};

export const createClassroom = async (req, res) => {
  const { name, capacity } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO classrooms (name, capacity) VALUES ($1, $2) RETURNING *",
      [name, capacity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to create classroom" });
  }
};