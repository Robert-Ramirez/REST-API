const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });

const sequelize = require('../config/config');
// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() =>
    console.log(
      "tasks table has been successfully created, if one doesn't exist"
    )
  )
  .catch(error => console.log('This error occured', error));
