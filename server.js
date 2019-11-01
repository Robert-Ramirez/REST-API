const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is on at port ${port}`);
});

exports.module = dotenv;
