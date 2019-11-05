const { Pool } = require('pg');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    const sql = 'SELECT role FROM users WHERE id=$1';
    const params = [req.params.userId];
    const results = await pool.query(sql, params);
    if (!roles.includes(results.rows[0].role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  });
};
