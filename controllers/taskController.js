const Task = require('./../models/taskModel');

exports.getAllTasks = async (req, res) => {
  try {
    // EXECUTE QUERY
    const tasks = await Task.find();

    // SEND RESPONSE
    res.status(200).json({
      results: tasks.length,
      tasks
    });
  } catch (err) {
    res.status(404).json({
      message: err
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    res.status(200).json({
      task
    });
  } catch (err) {
    res.status(404).json({
      message: err
    });
  }
};

exports.createTask = async (req, res) => {
  try {

    const newtask = await Task.create(req.body);

    res.status(201).json({
        Task: newtask
    });
  } catch (err) {
    res.status(400).json({
      message: err
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json();
  } catch (err) {
    res.status(404).json({
      message: err
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(204).json();
  } catch (err) {
    res.status(404).json({
      message: err
    });
  }
};

