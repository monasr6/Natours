const multer = require('multer');

const factory = require('./factoryHandler');
const User = require('../models/User');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../client/public/img/users');
  },
  filename: (req, file, cb) => {
    // user-1234567890abc-1234567890.jpeg
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  // console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image, please upload only images'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.getAllUsers = factory.getAll(User);

exports.checkID = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
  next();
};

exports.createUser = (req, res, next) => {
  res.status(400).json({
    status: 'error',
    message: 'you can register from signup page',
  });
};

exports.updateMe = (req, res, next) => {
  req.params.id = req.user.id;

  req.body = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.file) req.body.photo = req.file.filename;
  // console.log(req.body);
  // const user = factory.updateOne(User);
  next();
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
