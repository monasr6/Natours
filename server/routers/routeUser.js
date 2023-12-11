const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);

router.route('/forgotpassword').post(authController.forgetPassword);
//router.route('/resetpassword/:token').patch(authController.resetPassword);
router.route('/updatePassword').patch(authController.updatePassword);

// Create a checkBody middleware
router.use(authController.protect);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/me')
  .get(userController.getMe, userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.updateMe,
    userController.updateUser,
  )
  .delete(userController.getMe, userController.deleteUser);

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
