const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const offset = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const users = await User.findAll({ limit, offset, where: { active: true } });
  res.status(200).json({
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const user = await User.findOne({ where: { id: id, active: true } });
  res.status(200).json({
    data: {
      user
    }
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'This route is not defined! Please use /signup instead!'
  });
};

exports.updateUser = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const { name, email, role, active } = req.body;
  const user = await User.update(
    { name: name, email: email, role: role, active: active },
    { where: { id } }
  );
  res.status(200).json({
    data: {
      user
    }
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const user = await User.update({ active: false }, { where: { id } });
  res.status(200).json({
    data: {
      user
    }
  });
});
