const Task = require('../models/taskModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const offset = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const tasks = await Task.findAll({ limit, offset, where: { active: true } });
  res.status(200).json({
    results: tasks.length,
    data: {
      tasks
    }
  });
});

exports.getTask = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const task = await Task.findOne({ where: { id: id, active: true } });
  res.status(200).json({
    data: {
      task
    }
  });
});

exports.createTask = catchAsync(async (req, res) => {
  const { name, duration, description } = req.body;
  const newTask = await Task.create({
    name: name,
    duration: duration,
    description: description,
    userId: req.user.id
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
  const task = await Task.update(
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
  const task = await Task.update({ active: false }, { where: { id } });
  res.status(200).json({
    data: {
      task
    }
  });
});
