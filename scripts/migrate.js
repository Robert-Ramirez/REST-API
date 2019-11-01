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

const Tasks = JSON.parse(
  fs.readFileSync(`${__dirname}./../dev-data/data/tasks-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  const sql =
    'INSERT INTO tasks(name, duration, description) VALUES ($1, $2, $3)';
  let i = 0;
  while (i < Tasks.length) {
    const params = [Tasks[i].name, Tasks[i].duration, Tasks[i].discription];
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
  const sql = 'DELETE FROM tasks';
  pool.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
  });
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
