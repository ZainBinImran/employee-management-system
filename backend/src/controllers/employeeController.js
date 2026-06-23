const pool = require('../config/database');

// GET /api/employees
const getAllEmployees = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        e.*,
        d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON d.id = e.department_id
      ORDER BY e.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

// GET /api/employees/:id
const getEmployee = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT e.*, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON d.id = e.department_id
      WHERE e.id = $1
    `, [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

// POST /api/employees
const createEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, role, salary, hire_date, department_id } = req.body;

    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !role?.trim() || !salary || !hire_date || !department_id) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const result = await pool.query(`
      INSERT INTO employees
        (first_name, last_name, email, phone, role, salary, hire_date, department_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `, [
      first_name.trim(), last_name.trim(), email.trim().toLowerCase(),
      phone?.trim() || null, role.trim(),
      parseFloat(salary), hire_date, parseInt(department_id)
    ]);
    res.status(201).json({ success: true, data: result.rows[0], message: 'Employee created' });
  } catch (err) { next(err); }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role, salary, hire_date, department_id } = req.body;

    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !role?.trim() || !salary || !hire_date || !department_id) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const result = await pool.query(`
      UPDATE employees SET
        first_name=$1, last_name=$2, email=$3, phone=$4,
        role=$5, salary=$6, hire_date=$7, department_id=$8,
        updated_at=NOW()
      WHERE id=$9
      RETURNING *
    `, [
      first_name.trim(), last_name.trim(), email.trim().toLowerCase(),
      phone?.trim() || null, role.trim(),
      parseFloat(salary), hire_date, parseInt(department_id), id
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Employee updated' });
  } catch (err) { next(err); }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM employees WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };