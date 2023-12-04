const Tour = require('../models/Tour');
const Filtering = require('../utils/filterQuerystring');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTours = async (req, res, next) => {
  // make a copy of req.query

  // filtering
  const queryObj = new Filtering(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // get all the fields that are not allowed to be filtered
  const tours = await queryObj.query;
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: tours,
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ _id: req.params.id }).populate({
    path: 'reviews',
    select: '-__v -passwordChangedAt',
  });
  if (!tour) {
    return new AppError('No tour found with that ID', 404);
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newtour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newtour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return new AppError('No tour found with that ID', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return new AppError('No tour found with that ID', 404);
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
