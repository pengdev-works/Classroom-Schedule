const { query } = require('../config/db');

exports.getAllSchedules = async (req, res) => {
    try {
        const result = await query(`
            SELECT s.*, r.room_number, f.name as faculty_name, sub.name as subject_name, sec.name as section_name
            FROM schedules s
            JOIN rooms r ON s.room_id = r.id
            JOIN faculty f ON s.faculty_id = f.id
            JOIN subjects sub ON s.subject_id = sub.id
            JOIN sections sec ON s.section_id = sec.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSchedule = async (req, res) => {
    const { room_id, faculty_id, subject_id, section_id, day_of_week, start_time, end_time } = req.body;
    
    try {
        // Conflict detection logic
        const conflictCheck = await query(`
            SELECT * FROM schedules 
            WHERE day_of_week = $1 
            AND (
                (start_time < $3 AND end_time > $2) -- Overlapping time
            )
            AND (
                room_id = $4 OR faculty_id = $5 OR section_id = $6
            )
        `, [day_of_week, start_time, end_time, room_id, faculty_id, section_id]);

        if (conflictCheck.rows.length > 0) {
            const conflict = conflictCheck.rows[0];
            let message = 'Schedule conflict detected';
            if (conflict.room_id === room_id) message = 'Room is already booked for this time';
            if (conflict.faculty_id === faculty_id) message = 'Faculty member is already assigned to another class during this time';
            if (conflict.section_id === section_id) message = 'Section already has a class scheduled during this time';
            
            return res.status(409).json({ message });
        }

        const result = await query(
            'INSERT INTO schedules (room_id, faculty_id, subject_id, section_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [room_id, faculty_id, subject_id, section_id, day_of_week, start_time, end_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM schedules WHERE id = $1', [id]);
        res.json({ message: 'Schedule deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
