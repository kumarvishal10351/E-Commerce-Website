const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateReview } = require('../middleware/validate');
const { createReview, updateReview, deleteReview, getProductReviews } = require('../controllers/reviewController');

router.post('/:productId', protect, validateReview, createReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
