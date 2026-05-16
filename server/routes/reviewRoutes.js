/**
 * SECTION: Review routes — mounted at /api/reviews
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateReview } = require('../middleware/validate');
const { createReview, updateReview, deleteReview, getProductReviews } = require('../controllers/reviewController');

// ─── Private: create review for a product ───
router.post('/:productId', protect, validateReview, createReview);

// ─── Private: update/delete by review ID ───
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);

// ─── Public: list reviews for a product ───
router.get('/product/:productId', getProductReviews);

module.exports = router;
