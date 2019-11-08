const fs = require('fs');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const catchAsync = require('./../utils/catchAsync');

dotenv.config({ path: `${__dirname}./../config.env` });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

const createTables = () => {
  const users = `CREATE TABLE IF NOT EXISTS
      user(
        id SERIAL PRIMARY KEY,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        passwordconfirm VARCHAR(128) NOT NULL,
        passwordResettoken VARCHAR(128) NOT NULL,
        passwordResetexpires VARCHAR(128) NOT NULL,
        role VARCHAR(128) NOT NULL
      )`;
  pool
    .query(users)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};

const users = JSON.parse(
  fs.readFileSync(`${__dirname}./../dev-data/data/users-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = catchAsync(async () => {
  const sql =
    'INSERT INTO users(email, password, passwordconfirm, passwordResettoken, passwordResetexpires, role) VALUES ($1, $2, $3, $4, $5, $6)';
  const password = await bcrypt.hash(users[0].password, 12);
  const params = [
    users[0].email,
    password,
    password,
    users[0].passwordResettoken,
    users[0].passwordResetexpires,
    users[0].role
  ];
  pool.query(sql, params);
});

// DELETE ALL DATA FROM DB
const deleteData = catchAsync(async () => {
  const sql = 'DROP TABLE IF EXISTS user';
  pool.query(sql);
});

if (process.argv[2] === '--import') {
  createTables();
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
