const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'ems_db',
  user:     process.env.DB_USER     || 'ems_user',
  password: process.env.DB_PASSWORD || 'ems_password',
  // Pool settings
  max:             10,   // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('[DB] Connection failed:', err.message);
    return;
  }
  console.log('[DB] Connected to PostgreSQL successfully');
  release();
});

module.exports = pool;
