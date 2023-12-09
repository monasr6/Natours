const factory = require('./factoryHandler');
const User = require('../models/User');

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
  res.status(400).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteMe = (req, res, next) => {
  res.status(400).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);