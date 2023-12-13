const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const Email = require('../utils/email');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body); // this is not secure because it allows to create a new user with admin rights
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.passwordConfirm
  ) {
    return next(new AppError('Please provide all the required fields', 400));
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || 'user',
  }); // this is secure because it allows to create a new user without admin rights
  const token = signToken(newUser._id, res);
  newUser.password = undefined;

  const url = `${req.get('host')}/me`;

  await new Email(newUser, url).sendWelcome();

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  // 2) verfication token

  // 3) check if user exists && password is correct
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 4) if everything ok, send token to client

  res.status(200).json({
    token: signToken(user._id, res),
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  // get token from header
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token || token === 'null') {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401),
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.forgetPassword = async (req, res, next) => {
  // get email
  const { email } = req.body;
  if (!email) {
    return new AppError('please send your email ', 401);
  }
  const user = await User.findOne({ email });
  if (!user) {
    return new AppError('please send a correct email ', 401);
  }
  const resetToken = user.getresettoken();

  await user.save({ validateBeforeSave: false });

  const reseturl = `${req.get('host')}/api/v1/users/${resetToken}`;

  const message = `Forget password form ${req.get(
    'host',
  )} to reset go to :\n ${reseturl}`;
  await sendEmail({ email, message });
  return res.status(200).json({
    status: 'seccess',
    message: 'Email send successfully',
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from db
  const { lastPassword, newPassword, confirmNewPassword } = req.body;
  if (!lastPassword || !newPassword || !confirmNewPassword) {
    return next(new AppError('please send all the required fields', 401));
  }

  const user = await User.findOne({ _id: req.user._id }).select('+password');

  if (!user) {
    return next(new AppError('you are not loged in please lig in again'));
  }
  // check if last password is correct
  if (!(await user.correctPassword(lastPassword, user.password))) {
    return next(new AppError('please send the correct last password', 401));
  }

  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;
  await user.save();

  res.status(201).json({
    status: 'success',
    token: signToken(user._id, res),
    message: 'updated password successfully',
  });
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'logged out' });
};
