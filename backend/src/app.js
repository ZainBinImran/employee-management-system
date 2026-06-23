require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const departmentRoutes = require('./routes/departments');
const employeeRoutes   = require('./routes/employees');
const dashboardRoutes  = require('./routes/dashboard');
const errorHandler     = require('./middleware/errorHandler');
const notFound         = require('./middleware/notFound');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & Parsing ─────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging ────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const pool = require('./config/database');
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      status:  'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      success:  false,
      status:   'unhealthy',
      database: 'disconnected',
    });
  }
});

// ── API Routes ─────────────────────────────────────────────
app.use('/api/departments', departmentRoutes);
app.use('/api/employees',   employeeRoutes);
app.use('/api/dashboard',   dashboardRoutes);

// ── Error Handling ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Graceful Shutdown ──────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV}`);
  console.log(`[SERVER] Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
