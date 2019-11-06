const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    token,
    user
  });
};

const createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return [passwordResetToken, passwordResetExpires];
};

const correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

exports.signup = catchAsync(async (req, res, next) => {
  const sql =
    'INSERT INTO users(email, password, passwordconfirm, passwordResettoken, passwordResetexpires, role) VALUES ($1, $2, $3, $4, $5, $6)';

  const password = await bcrypt.hash(req.body.password, 12);
  const resetToken = createPasswordResetToken();
  const params = [
    req.body.email,
    password,
    password,
    resetToken[0],
    resetToken[1],
    'user'
  ];
  const newUser = await pool.query(sql, params);
  newUser.passwordresettoken = undefined;
  newUser.passwordresetexpires = undefined;
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const sql = 'SELECT * FROM users WHERE email=$1';
  const params = [email];
  const user = await pool.query(sql, params);

  if (!user || !(await correctPassword(password, user.rows[0].password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const sql = 'SELECT * FROM users WHERE id=$1';
  const params = [decoded.id];
  const currentUser = await pool.query(sql, params);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // roles ['admin', 'user']
    const sql = 'SELECT role FROM users WHERE id=$1';
    const params = [req.params.userId];
    const results = await pool.query(sql, params);
    if (!roles.includes(results.rows[0].role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const sql = 'SELECT * FROM users WHERE email=$1';
  const params = [req.body.email];
  const user = await pool.query(sql, params);
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = createPasswordResetToken();

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken[0]}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const sql =
    'UPDATE users SET password=$1, passwordconfirm=$2, passwordresettoken=$3, passwordresetexpires=$4  WHERE passwordresettoken=$5';
  const password = await bcrypt.hash(req.body.password, 12);
  const resetToken = createPasswordResetToken();
  const params = [
    password,
    password,
    resetToken[0],
    resetToken[1],
    hashedToken
  ];
  const user = await pool.query(sql, params);

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordconfirm = req.body.passwordconfirm;
  user.passwordresettoken = undefined;
  user.passwordresetexpires = undefined;

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const { email, password } = req.body;
  const sql = 'UPDATE users SET password=$1, passwordconfirm=$2 WHERE email=$3';
  const pass = await bcrypt.hash(password, 12);
  const params = [email, pass, pass];
  const user = await pool.query(sql, params);

  // 2) Log user in, send JWT
  createSendToken(user, 200, res);
});
