const fs = require('fs');
const dotenv = require('dotenv');
const { Pool } = require('pg');

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
      users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
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
const importData = async () => {
  const sql = 'INSERT INTO users(email, password, role) VALUES ($1, $2, $3)';
  let i = 0;
  while (i < users.length) {
    const params = [users[i].email, users[i].password, users[i].role];
    pool.query(sql, params, (error, results) => {
      if (error) {
        throw error;
      }
    });
    i += 1;
  }
};
// DELETE ALL DATA FROM DB
const deleteData = async () => {
  const sql = 'DROP TABLE IF EXISTS users';
  pool.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
  });
};

if (process.argv[2] === '--import') {
  createTables();
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
