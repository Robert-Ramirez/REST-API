const models = require('../database/models');

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await models.Task.findAll({
      where: { active: true }
    });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await models.Task.findOne({
      where: { id: req.params.taskId, active: true }
    });
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const newTask = await models.Task.create(req.body);
    res.status(200).json(newTask);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const id = [req.params.taskId];
    const { name, duration, description, active } = req.body;
    const task = await models.Task.update(
      {
        name: name,
        duration: duration,
        description: description,
        active: active
      },
      { where: { id: id } }
    );
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const id = [req.params.taskId];
    const task = await models.Task.update(
      { active: false },
      { where: { id: id } }
    );
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};
