const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const task = sequelize.define('task', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() =>
    console.log(
      "tasks table has been successfully created, if one doesn't exist"
    )
  )
  .catch(error => console.log('This error occured', error));

module.exports = task;
