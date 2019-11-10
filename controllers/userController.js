const models = require('../database/models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await models.User.findAll({
    where: { active: true }
  });
  res.status(200).json({
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const user = await models.User.findOne({ where: { id: id, active: true } });
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
  const user = await models.User.update(
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
  const user = await models.User.update({ active: false }, { where: { id } });
  res.status(200).json({
    data: {
      user
    }
  });
});
