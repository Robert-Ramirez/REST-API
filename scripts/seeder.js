const dotenv = require('dotenv');
const { Pool } = require('pg');
const faker = require('faker');

dotenv.config({
  path: `${__dirname}./../config.env`
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

// IMPORT DATA INTO DB
const importData = async () => {
  const sql =
    'INSERT INTO tasks(name, duration, description) VALUES ($1, $2, $3)';
  let i = 0;
  while (i < 10) {
    //Faker object
    const params = [faker.name.findName(), i, faker.address.streetAddress()];
    pool.query(sql, params, (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
    });
    i += 1;
  }
};

if (process.argv[2] === '--import') {
  importData();
}
