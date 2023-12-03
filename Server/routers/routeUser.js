const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authControler');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotpassword').post(authController.forgetPassword);
//router.route('/resetpassword/:token').patch(authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

// Create a checkBody middleware
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
