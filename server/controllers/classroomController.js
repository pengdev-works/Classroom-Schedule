import { pool } from "../config/db.js";

export const getClassrooms = async (req,res)=>{
  const result = await pool.query("SELECT * FROM classrooms ORDER BY id DESC");
  res.json(result.rows);
}

export const createClassroom = async (req,res)=>{
  const { name, capacity, building } = req.body;
  const result = await pool.query(
    "INSERT INTO classrooms (name,capacity,building) VALUES($1,$2,$3) RETURNING *",
    [name, capacity, building]
  );
  res.status(201).json(result.rows[0]);
}

export const updateClassroom = async (req,res)=>{
  const { id } = req.params;
  const { name, capacity, building } = req.body;
  const result = await pool.query(
    "UPDATE classrooms SET name=$1,capacity=$2,building=$3 WHERE id=$4 RETURNING *",
    [name, capacity, building, id]
  );
  res.json(result.rows[0]);
}

export const deleteClassroom = async (req,res)=>{
  const { id } = req.params;
  await pool.query("DELETE FROM classrooms WHERE id=$1",[id]);
  res.json({ message:"Classroom deleted" });
}