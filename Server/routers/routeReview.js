const express = require('express');
const reviewControler = require('../controllers/reviewControler');

const router = express.Router();

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(reviewControler.createReview);

router
  .route('/:id')
  .get(reviewControler.getreview)
  .patch(reviewControler.updateReview)
  .delete(reviewControler.deleteReview);

module.exports = router;
