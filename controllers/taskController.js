const Task = require('../models/taskModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAlltasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.findAll({ where: { active: true } });
  res.status(200).json({
    results: tasks.length,
    data: {
      tasks
    }
  });
});

exports.gettask = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const task = await Task.findOne({ where: { id: id, active: true } });
  res.status(200).json({
    data: {
      task
    }
  });
});

exports.createtask = (req, res) => {
  res.status(500).json({
    message: 'This route is not defined! Please use /signup instead!'
  });
};

exports.updatetask = catchAsync(async (req, res) => {
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

exports.deletetask = catchAsync(async (req, res) => {
  const id = [req.params.id];
  const task = await Task.update({ active: false }, { where: { id } });
  res.status(200).json({
    data: {
      task
    }
  });
});
