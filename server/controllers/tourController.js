const Tour = require('../models/Tour');
const Filtering = require('../utils/filterQuerystring');
const factory = require('./factoryHandler');

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

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);
