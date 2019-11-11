const models = require('../database/models');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await models.User.findAll({
      where: { active: true }
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: { id: req.params.userId, active: true }
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await models.User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = [req.params.userId];
    const { name, email, role, active } = req.body;
    const user = await models.User.update(
      { name: name, email: email, role: role, active: active },
      { where: { id: id } }
    );
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = [req.params.userId];
    const user = await models.User.update(
      { active: false },
      { where: { id: id } }
    );
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
