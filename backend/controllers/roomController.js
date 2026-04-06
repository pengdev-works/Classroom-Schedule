const { query } = require('../config/db');

exports.getAllRooms = async (req, res) => {
    try {
        const result = await query('SELECT * FROM rooms');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRoom = async (req, res) => {
    const { capacity, building, roomNumber } = req.body;
    try {
        const result = await query(
            'INSERT INTO rooms (capacity, building, room_number) VALUES ($1, $2, $3) RETURNING *',
            [capacity, building, roomNumber]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { capacity, building, roomNumber } = req.body;
    try {
        const result = await query(
            'UPDATE rooms SET capacity = $1, building = $2, room_number = $3 WHERE id = $4 RETURNING *',
            [capacity, building, roomNumber, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM rooms WHERE id = $1', [id]);
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
