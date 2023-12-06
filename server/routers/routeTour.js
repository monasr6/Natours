const express = require('express');
const tourController = require('../controllers/tourController');
const authControler = require('../controllers/authControler');
const reviewRouter = require('./routeReview');

const router = express.Router();

// Create a checkBody middleware

// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authControler.protect, tourController.createTour);

router.use(authControler.protect);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
