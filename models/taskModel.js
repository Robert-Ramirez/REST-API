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
      minlength: [10, 'A task name must have more or equal then 10 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A task must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A task must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A task must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A task must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A task must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A task must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      //hide the field
      select: false
    },
    startDates: [Date],
    secrettask: {
      type: Boolean,
      default: false
    }
  },
  {
    //include virtual as part of the output both object and json
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//doesn't need to be stored can be created virtual (metric conversion)
//can't query on it because it is not stored. just calculation done in the model
taskSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
taskSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// taskSchema.pre('find', function(next) {
taskSchema.pre(/^find/, function(next) {
  this.find({ secrettask: { $ne: true } });

  this.start = Date.now();
  next();
});

taskSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
taskSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secrettask: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
