import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

// Get all student enrollments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        sc.id, 
        sc.student_id, 
        sc.classroom_id, 
        sc.created_at,
        u.name as student_name,
        c.name as classroom_name
      FROM student_classrooms sc
      JOIN users u ON sc.student_id = u.id
      JOIN classrooms c ON sc.classroom_id = c.id
      ORDER BY sc.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching enrollments" });
  }
});

// Get enrollments for a specific student
router.get("/student/:student_id", async (req, res) => {
  try {
    const { student_id } = req.params;
    const result = await pool.query(
      `SELECT 
        sc.id, 
        sc.student_id, 
        sc.classroom_id, 
        sc.created_at,
        c.name as classroom_name
      FROM student_classrooms sc
      JOIN classrooms c ON sc.classroom_id = c.id
      WHERE sc.student_id = $1
      ORDER BY sc.created_at DESC`,
      [student_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching student enrollments" });
  }
});

// Create enrollment
router.post("/", async (req, res) => {
  try {
    const { student_id, classroom_id } = req.body;

    if (!student_id || !classroom_id) {
      return res.status(400).json({ message: "student_id and classroom_id are required" });
    }

    // Check if already enrolled
    const existing = await pool.query(
      "SELECT id FROM student_classrooms WHERE student_id = $1 AND classroom_id = $2",
      [student_id, classroom_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Student is already enrolled in this classroom" });
    }

    // Create enrollment
    const result = await pool.query(
      "INSERT INTO student_classrooms (student_id, classroom_id, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [student_id, classroom_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating enrollment" });
  }
});

// Delete enrollment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM student_classrooms WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Enrollment deleted", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting enrollment" });
  }
});

export default router;
