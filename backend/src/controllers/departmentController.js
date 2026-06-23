const pool = require('../config/database');

// GET /api/departments
const getAllDepartments = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.name,
        d.description,
        d.created_at,
        COUNT(e.id)::int AS employee_count
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id
      GROUP BY d.id
      ORDER BY d.name
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

// POST /api/departments
const createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }
    const result = await pool.query(
      'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *',
      [name.trim(), description?.trim() || null]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Department created' });
  } catch (err) { next(err); }
};

// PUT /api/departments/:id
const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }
    const result = await pool.query(
      'UPDATE departments SET name=$1, description=$2, updated_at=NOW() WHERE id=$3 RETURNING *',
      [name.trim(), description?.trim() || null, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Department updated' });
  } catch (err) { next(err); }
};

// DELETE /api/departments/:id
const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM departments WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAllDepartments, createDepartment, updateDepartment, deleteDepartment };
