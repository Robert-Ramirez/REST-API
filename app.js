const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const sequelize = require('./utils/database');
const Task = require('./models/taskModel');
const User = require('./models/userModel');

// invoke an instance of express application.
const app = express();

app.use(helmet());
// set morgan to log info about our requests for development use.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// initialize body-parser to parse incoming parameters requests to req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration']
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

Task.belongsTo(User);
// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() =>
    console.log(
      "tasks table has been successfully created, if one doesn't exist"
    )
  )
  .catch(error => console.log('This error occured', error));

module.exports = app;
