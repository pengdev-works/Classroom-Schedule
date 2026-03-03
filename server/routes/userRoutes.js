import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

// Get all users (optionally filter by role)
router.get("/", async (req, res) => {
  try {
    const { role } = req.query;
    let query = "SELECT id, name, email, role, created_at FROM users";
    const params = [];

    if (role) {
      query += " WHERE role = $1";
      params.push(role);
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

export default router;
