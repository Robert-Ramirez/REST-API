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
  const tasks = `CREATE TABLE IF NOT EXISTS
      tasks(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        duration INT NOT NULL,
        description VARCHAR(128) NOT NULL,
        userId INTEGER REFERENCES users(id)
      )`;
  pool
    .query(tasks)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};

const Tasks = JSON.parse(
  fs.readFileSync(`${__dirname}./../dev-data/data/tasks-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  const sql =
    'INSERT INTO tasks(name, duration, description, userID) VALUES ($1, $2, $3, $4)';
  let i = 0;
  while (i < Tasks.length) {
    const params = [
      Tasks[i].name,
      Tasks[i].duration,
      Tasks[i].description,
      Tasks[i].userID
    ];
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
  const sql = 'DROP TABLE IF EXISTS tasks';
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
