import { pool } from "../config/db.js";

export const getSchedules = async (req,res)=>{
  const result = await pool.query(
    `SELECT s.id, c.name AS classroom, sub.name AS subject, t.name AS teacher,
            s.day, s.start_time, s.end_time
     FROM schedules s
     JOIN classrooms c ON s.classroom_id=c.id
     JOIN subjects sub ON s.subject_id=sub.id
     JOIN teachers t ON s.teacher_id=t.id
     ORDER BY s.day, s.start_time`
  );
  res.json(result.rows);
}

export const createSchedule = async (req,res)=>{
  const { classroom_id, subject_id, teacher_id, day, start_time, end_time } = req.body;

  // Conflict check
  const conflict = await pool.query(
    `SELECT * FROM schedules 
     WHERE classroom_id=$1 AND day=$2 AND (
       ($3 BETWEEN start_time AND end_time) OR
       ($4 BETWEEN start_time AND end_time)
     )`, [classroom_id, day, start_time, end_time]
  );

  if(conflict.rows.length>0) return res.status(400).json({ message:"Schedule conflict" });

  const result = await pool.query(
    `INSERT INTO schedules (classroom_id, subject_id, teacher_id, day, start_time, end_time)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [classroom_id, subject_id, teacher_id, day, start_time, end_time]
  );

  res.status(201).json(result.rows[0]);
}

export const updateSchedule = async (req,res)=>{
  const { id } = req.params;
  const { classroom_id, subject_id, teacher_id, day, start_time, end_time } = req.body;

  const conflict = await pool.query(
    `SELECT * FROM schedules WHERE classroom_id=$1 AND day=$2 AND id<>$3 AND (
       ($4 BETWEEN start_time AND end_time) OR
       ($5 BETWEEN start_time AND end_time)
     )`, [classroom_id, day, id, start_time, end_time]
  );

  if(conflict.rows.length>0) return res.status(400).json({ message:"Schedule conflict" });

  const result = await pool.query(
    `UPDATE schedules SET classroom_id=$1, subject_id=$2, teacher_id=$3, day=$4, start_time=$5, end_time=$6
     WHERE id=$7 RETURNING *`,
    [classroom_id, subject_id, teacher_id, day, start_time, end_time, id]
  );

  res.json(result.rows[0]);
}

export const deleteSchedule = async (req,res)=>{
  const { id } = req.params;
  await pool.query("DELETE FROM schedules WHERE id=$1",[id]);
  res.json({ message:"Schedule deleted" });
}