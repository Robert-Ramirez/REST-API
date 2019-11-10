const models = require('../database/models');
const catchAsync = require('./../utils/catchAsync');

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await models.Task.findAll({
    where: { active: true }
  });
  res.status(200).json({
    results: tasks.length,
    data: {
      tasks
    }
  });
});

exports.getTask = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const task = await models.Task.findOne({ where: { id: id, active: true } });
  res.status(200).json({
    data: {
      task
    }
  });
});

exports.createTask = catchAsync(async (req, res) => {
  const { name, duration, description, userId } = req.body;
  const newTask = await models.Task.create({
    name: name,
    duration: duration,
    description: description,
    userId: userId
  });
  res.status(200).json({
    data: {
      newTask
    }
  });
});

exports.updateTask = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const { name, duration, description, active } = req.body;
  const task = await models.Task.update(
    {
      name: name,
      duration: duration,
      description: description,
      active: active
    },
    { where: { id } }
  );
  res.status(200).json({
    data: {
      task
    }
  });
});

exports.deleteTask = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const task = await models.Task.update({ active: false }, { where: { id } });
  res.status(200).json({
    data: {
      task
    }
  });
});
