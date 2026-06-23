function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);

  // Postgres unique violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with that value already exists',
    });
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
}

module.exports = errorHandler;
