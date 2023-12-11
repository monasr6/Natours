const multer = require('multer');

const AppError = require('../utils/appError');
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

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.updateImageCover = async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  if (!req.file) {
    return next();
  }

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}.jpeg`;

  factory.resizeImage(
    req.files.imageCover[0],
    'tours',
    req.body.imageCover,
    2000,
    1333,
  );

  req.body.images = [];
  Promise.all(
    req.fields.images.map(async (image) => {
      const filename = `tour-${req.params.id}-${Date.now()}.jpeg`;
      factory.resizeImage(image, 'tours', filename, 2000, 1333);
      req.body.images.push(filename);
    }),
  );

  next();
};

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);
