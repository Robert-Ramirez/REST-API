const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

exports.gettasks = async (req, res) => {
  const sql = 'SELECT * FROM tasks ORDER BY id ASC';
  pool.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

exports.getTasksById = async (req, res) => {
  const sql = 'SELECT * FROM tasks WHERE id=$1';
  const params = [req.params.id];

  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

exports.createTasks = async (req, res) => {
  const sql =
    'INSERT INTO tasks (name, duration, description) VALUES ($1, $2, $3)';
  const params = [req.body.name, req.body.duration, req.body.description];
  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send();
  });
};

exports.updateTasksPut = async (req, res) => {
  const sql =
    'UPDATE tasks SET name=$1, duration=$2, description=$3 WHERE id=$4';
  const params = [
    req.body.name,
    req.body.duration,
    req.body.description,
    req.params.id
  ];

  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send();
  });
};

exports.updateTasksPatch = async (req, res) => {
  const sql = 'UPDATE tasks SET name=$1 WHERE id=$2';
  const params = [req.body.name, req.params.id];
  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send();
  });
};

exports.deleteTasks = async (req, res) => {
  const sql = 'DELETE FROM tasks WHERE id=$1';
  const params = [req.params.id];

  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send();
  });
};
