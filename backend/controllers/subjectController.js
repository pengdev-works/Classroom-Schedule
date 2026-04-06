const { query } = require('../config/db');

exports.getAllSubjects = async (req, res) => {
    try {
        const result = await query('SELECT * FROM subjects');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSubject = async (req, res) => {
    const { code, name, units } = req.body;
    try {
        const result = await query(
            'INSERT INTO subjects (code, name, units) VALUES ($1, $2, $3) RETURNING *',
            [code, name, units]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSubject = async (req, res) => {
    const { id } = req.params;
    const { code, name, units } = req.body;
    try {
        const result = await query(
            'UPDATE subjects SET code = $1, name = $2, units = $3 WHERE id = $4 RETURNING *',
            [code, name, units, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM subjects WHERE id = $1', [id]);
        res.json({ message: 'Subject deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
