const models = require('../database/models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await models.Task.findAll({
    where: { active: true }
  });
  res.status(200).json(tasks);
});

exports.getTask = catchAsync(async (req, res) => {
  const task = await models.Task.findOne({
    where: { id: req.params.taskId, active: true }
  });
  res.status(200).json(task);
});

exports.createTask = catchAsync(async (req, res) => {
  const newTask = await models.Task.create(req.body);
  res.status(200).json(newTask);
});

exports.updateTask = catchAsync(async (req, res) => {
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
});

exports.deleteTask = catchAsync(async (req, res) => {
  const id = [req.params.taskId];
  const task = await models.Task.update(
    { active: false },
    { where: { id: id } }
  );
  res.status(200).json(task);
});
