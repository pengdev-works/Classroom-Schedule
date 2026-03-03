import { pool } from "../config/db.js";

export const getTeachers = async (req,res)=>{
  const result = await pool.query("SELECT * FROM teachers ORDER BY id DESC");
  res.json(result.rows);
}

export const createTeacher = async (req,res)=>{
  const { name, email, specialization } = req.body;
  const result = await pool.query(
    "INSERT INTO teachers (name,email,specialization) VALUES($1,$2,$3) RETURNING *",
    [name,email,specialization]
  );
  res.status(201).json(result.rows[0]);
}

export const updateTeacher = async (req,res)=>{
  const { id } = req.params;
  const { name, email, specialization } = req.body;
  const result = await pool.query(
    "UPDATE teachers SET name=$1,email=$2,specialization=$3 WHERE id=$4 RETURNING *",
    [name,email,specialization,id]
  );
  res.json(result.rows[0]);
}

export const deleteTeacher = async (req,res)=>{
  const { id } = req.params;
  await pool.query("DELETE FROM teachers WHERE id=$1",[id]);
  res.json({ message:"Teacher deleted" });
}