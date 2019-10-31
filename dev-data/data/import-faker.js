const mongoose = require('mongoose');
const dotenv = require('dotenv');
const faker = require('faker');

const Task = require('./../../models/taskModel');

dotenv.config({ path: './../../config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

//Faker object
const Tasks = [
  { name: faker.name.findName(), description: faker.address.streetAddress() },
  { name: faker.name.findName(), description: faker.address.streetAddress() },
  { name: faker.name.findName(), description: faker.address.streetAddress() },
  { name: faker.name.findName(), description: faker.address.streetAddress() },
  { name: faker.name.findName(), description: faker.address.streetAddress() }
];

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Task.create(Tasks);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Task.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
