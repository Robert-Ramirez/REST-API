const models = require('../database/models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await models.User.findAll({
    where: { active: true }
  });
  res.status(200).json(users);
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await models.User.findOne({
    where: { id: req.params.userId, active: true }
  });
  res.status(200).json(user);
});

exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'This route is not defined! Please use /signup instead!'
  });
};

exports.updateUser = catchAsync(async (req, res) => {
  const id = [req.params.userId];
  const { name, email, role, active } = req.body;
  const user = await models.User.update(
    { name: name, email: email, role: role, active: active },
    { where: { id: id } }
  );
  res.status(200).json(user);
});

exports.deleteUser = catchAsync(async (req, res) => {
  const id = [req.params.userId];
  const user = await models.User.update(
    { active: false },
    { where: { id: id } }
  );
  res.status(200).json(user);
});
