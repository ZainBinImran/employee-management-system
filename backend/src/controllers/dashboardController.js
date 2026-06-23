const pool = require('../config/database');

const getStats = async (req, res, next) => {
  try {
    const [empCount, deptCount, avgSalary, newThisMonth, recentHires] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM employees'),
      pool.query('SELECT COUNT(*)::int AS count FROM departments'),
      pool.query('SELECT COALESCE(ROUND(AVG(salary)::numeric, 0), 0) AS avg FROM employees'),
      pool.query(`
        SELECT COUNT(*)::int AS count FROM employees
        WHERE DATE_TRUNC('month', hire_date) = DATE_TRUNC('month', CURRENT_DATE)
      `),
      pool.query(`
        SELECT e.id, e.first_name, e.last_name, e.role, e.hire_date, d.name AS department_name
        FROM employees e
        LEFT JOIN departments d ON d.id = e.department_id
        ORDER BY e.hire_date DESC
        LIMIT 5
      `),
    ]);

    res.json({
      success: true,
      data: {
        totalEmployees:  empCount.rows[0].count,
        totalDepartments: deptCount.rows[0].count,
        avgSalary:       avgSalary.rows[0].avg,
        newThisMonth:    newThisMonth.rows[0].count,
        recentHires:     recentHires.rows,
      },
    });
  } catch (err) { next(err); }
};

module.exports = { getStats };
