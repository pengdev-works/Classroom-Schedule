const { query } = require('../config/db');

exports.getAllFaculty = async (req, res) => {
    try {
        const result = await query('SELECT * FROM faculty');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFaculty = async (req, res) => {
    const { name, department, email } = req.body;
    try {
        const result = await query(
            'INSERT INTO faculty (name, department, email) VALUES ($1, $2, $3) RETURNING *',
            [name, department, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFaculty = async (req, res) => {
    const { id } = req.params;
    const { name, department, email } = req.body;
    try {
        const result = await query(
            'UPDATE faculty SET name = $1, department = $2, email = $3 WHERE id = $4 RETURNING *',
            [name, department, email, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFaculty = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM faculty WHERE id = $1', [id]);
        res.json({ message: 'Faculty member deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
