// rating / createdAt / ref to tour / ref to user
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');
const mpngoose = require('mongoose');

const reviewSchema = new mpngoose.Schema({
  text: {
    type: String,
    required: [true, 'Review must have a text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  cretedAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: ObjectId,
    ref: 'Tour',
    required: ['true', 'review must have tour'],
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: ['true', 'review must have user'],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: '_id name' });
  // this.populate({ path: 'tour', select: '-__v -passwordChangedAt' });

  next();
});

module.exports = mongoose.model('Review', reviewSchema);
