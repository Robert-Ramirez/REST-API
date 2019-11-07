const { Pool } = require('pg');
const catchAsync = require('./../utils/catchAsync');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

exports.gettasks = catchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const params = [req.params.userId];
  const sql = `SELECT *
  FROM tasks
  WHERE userId=$1
  LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  const results = await pool.query(sql, params);
  res.status(200).json(results.rows);
});

exports.getTasksById = catchAsync(async (req, res) => {
  const sql = 'SELECT * FROM tasks WHERE id=$1 AND userId=$2';
  const params = [req.params.taskId, req.params.userId];
  const results = await pool.query(sql, params);
  res.status(200).json(results.rows);
});

exports.createTasks = catchAsync(async (req, res) => {
  const sql =
    'INSERT INTO tasks (name, duration, description, userId) VALUES ($1, $2, $3, $4)';
  const params = [
    req.body.name,
    req.body.duration,
    req.body.description,
    req.params.userId
  ];
  const result = await pool.query(sql, params);
  res.status(201).send();
});

exports.updateTasksPut = catchAsync(async (req, res) => {
  const sql =
    'UPDATE tasks SET name=$1, duration=$2, description=$3 WHERE id=$4 AND userId=$5';
  const params = [
    req.body.name,
    req.body.duration,
    req.body.description,
    req.params.taskId,
    req.params.userId
  ];
  const result = await pool.query(sql, params);
  res.status(200).send();
});

exports.updateTasksPatch = catchAsync(async (req, res) => {
  const sql = 'UPDATE tasks SET name=$1 WHERE id=$2 AND userId=$3';
  const params = [req.body.name, req.params.taskId, req.params.userId];
  const result = await pool.query(sql, params);
  res.status(200).send();
});

exports.deleteTasks = catchAsync(async (req, res) => {
  const sql = 'DELETE FROM tasks WHERE id=$1 AND userId=$2';
  const params = [req.params.taskId, req.params.userId];
  const result = await pool.query(sql, params);
  res.status(200).send();
});
