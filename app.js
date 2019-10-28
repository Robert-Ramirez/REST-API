const express = require('express');
const morgan = require('morgan');

const taskRouter = require('./routes/taskRouter');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tasks', taskRouter);

module.exports = app;