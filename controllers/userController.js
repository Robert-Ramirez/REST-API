const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

exports.getAllUsers = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const sql = `SELECT *
  FROM users
  LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  pool.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

exports.getUser = async (req, res) => {
  const sql = 'SELECT * FROM users WHERE id=$1';
  const params = [req.params.userId];

  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

exports.createUser = async (req, res) => {
  const sql = 'INSERT INTO users(email, password, role) VALUES ($1, $2, $3)';
  const params = [req.body.email, req.body.password, req.body.role];
  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send();
  });
};

exports.updateUserPut = async (req, res) => {
  const sql = 'UPDATE users SET email=$1, password=$2, role=$3 WHERE id=$4';
  const params = [
    req.body.email,
    req.body.password,
    req.body.role,
    req.params.userId
  ];

  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send();
  });
};

exports.updateUserPatch = async (req, res) => {
  const sql = 'UPDATE users SET email=$1 WHERE id=$2';
  const params = [req.body.email, req.params.userId];
  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send();
  });
};

exports.deleteUser = async (req, res) => {
  const sql = 'DELETE FROM users WHERE id=$1';
  const params = [req.params.userId];

  pool.query(sql, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send();
  });
};
