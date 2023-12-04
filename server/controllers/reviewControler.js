const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    count: reviews.length,
    reviews,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = Review.create(req.body);
  res.status(201).json({
    status: 'success',
    review,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: "didn't implement yet",
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: "didn't implement yet",
  });
});

exports.getreview = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: "didn't implement yet",
  });
});
