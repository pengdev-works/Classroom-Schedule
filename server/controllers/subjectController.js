import { pool } from "../config/db.js";

export const getSubjects = async (req,res)=>{
  const result = await pool.query("SELECT * FROM subjects ORDER BY id DESC");
  res.json(result.rows);
}

export const createSubject = async (req,res)=>{
  const { name, code, units } = req.body;
  const result = await pool.query(
    "INSERT INTO subjects (name,code,units) VALUES($1,$2,$3) RETURNING *",
    [name, code, units]
  );
  res.status(201).json(result.rows[0]);
}

export const updateSubject = async (req,res)=>{
  const { id } = req.params;
  const { name, code, units } = req.body;
  const result = await pool.query(
    "UPDATE subjects SET name=$1,code=$2,units=$3 WHERE id=$4 RETURNING *",
    [name, code, units, id]
  );
  res.json(result.rows[0]);
}

export const deleteSubject = async (req,res)=>{
  const { id } = req.params;
  await pool.query("DELETE FROM subjects WHERE id=$1",[id]);
  res.json({ message:"Subject deleted" });
}