const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const taskRouter = require('./routes/taskRouter');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1/tasks', taskRouter);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

module.exports = app;
