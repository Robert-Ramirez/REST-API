const mongoose = require('mongoose');
const slugify = require('slugify');

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A task must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A task name must have less or equal then 40 characters'],
      minlength: [4, 'A task name must have more or equal then 4 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A task must have a duration']
    },
    description: {
      type: String,
      trim: true
    }
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
