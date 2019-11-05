const { Pool } = require('pg');
const catchAsync = require('./../utils/catchAsync');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const sql = `SELECT *
  FROM users
  LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  const results = await pool.query(sql);
  res.status(200).json(results.rows);
});

exports.getUser = catchAsync(async (req, res) => {
  const sql = 'SELECT * FROM users WHERE id=$1';
  const params = [req.params.userId];
  const results = await pool.query(sql, params);
  res.status(200).json(results.rows);
});

exports.createUser = catchAsync(async (req, res) => {
  const sql = 'INSERT INTO users(email, password, role) VALUES ($1, $2, $3)';
  const params = [req.body.email, req.body.password, req.body.role];
  const results = await pool.query(sql, params);
  res.status(200).json(results.rows);
});

exports.updateUserPut = catchAsync(async (req, res) => {
  const sql = 'UPDATE users SET email=$1, password=$2, role=$3 WHERE id=$4';
  const params = [
    req.body.email,
    req.body.password,
    req.body.role,
    req.params.userId
  ];
  const results = await pool.query(sql, params);
  res.status(200).json(results.rows);
});
exports.updateUserPatch = catchAsync(async (req, res) => {
  const sql = 'UPDATE users SET email=$1 WHERE id=$2';
  const params = [req.body.email, req.params.userId];
  const results = await pool.query(sql, params);
  res.status(200).json(results.rows);
});

exports.deleteUser = catchAsync(async (req, res) => {
  const sql = 'DELETE FROM users WHERE id=$1';
  const params = [req.params.userId];
  const results = await pool.query(sql, params);
  res.status(200).json(results.rows);
});
