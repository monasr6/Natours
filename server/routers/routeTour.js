const express = require('express');
const tourController = require('../controllers/tourController');
const authControler = require('../controllers/authControler');

const router = express.Router();

// Create a checkBody middleware

// router.param('id', tourController.checkID);

router
  .route('/')
  .get(authControler.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authControler.protect, tourController.deleteTour);

module.exports = router;
