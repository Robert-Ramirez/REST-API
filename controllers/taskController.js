const Task = require('./../models/taskModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTasks = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTasks = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tasks.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tasks = await features.query;

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

exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ]);

    res.status(200).json({
        stats
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

    res.status(201).json();
  } catch (err) {
    res.status(400).json({
      message: err
    });
  }
};

exports.putTask = async (req, res) => {
  try {
    const task = await Task.findOneAndReplace(req.params.id, req.body, {
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

exports.patchTask = async (req, res) => {
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