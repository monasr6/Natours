const express = require('express');
const reviewControler = require('../controllers/reviewControler');
const authControler = require('../controllers/authControler');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(
    authControler.protect,
    authControler.restrictTo('user'),
    reviewControler.setTourUserIds,
    reviewControler.createReview,
  );

router.use(authControler.protect);

router
  .route('/:id')
  .get(reviewControler.getreview)
  .patch(reviewControler.updateReview)
  .delete(reviewControler.deleteReview);

module.exports = router;
