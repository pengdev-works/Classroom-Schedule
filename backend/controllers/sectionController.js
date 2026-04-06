const { query } = require('../config/db');

exports.getAllSections = async (req, res) => {
    try {
        const result = await query('SELECT * FROM sections');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSection = async (req, res) => {
    const { name, academic_program } = req.body;
    try {
        const result = await query(
            'INSERT INTO sections (name, academic_program) VALUES ($1, $2) RETURNING *',
            [name, academic_program]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSection = async (req, res) => {
    const { id } = req.params;
    const { name, academic_program } = req.body;
    try {
        const result = await query(
            'UPDATE sections SET name = $1, academic_program = $2 WHERE id = $3 RETURNING *',
            [name, academic_program, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSection = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM sections WHERE id = $1', [id]);
        res.json({ message: 'Section deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
