// const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const factory = require('./factoryHandler');

exports.checkTourId = (req, res, next) => {
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.TourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.getreview = factory.getOne(Review, { path: 'tour', select: 'name' });
