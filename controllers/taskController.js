const Task = require('./../models/taskModel');
const APIFeatures = require('./../utils/apiFeatures');


exports.getAllTasks = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Task.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const Tasks = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: Tasks.length,
      data: {
        Tasks
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const Task = await Task.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        Task
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTask = async (req, res) => {
  try {

    const newTask = await Task.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        Task: newTask
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const Task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        Task
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

