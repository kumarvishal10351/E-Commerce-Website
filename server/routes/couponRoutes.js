const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateCoupon } = require('../middleware/validate');
const { createCoupon, getCoupons, applyCoupon, deleteCoupon, updateCoupon } = require('../controllers/couponController');

router.route('/').post(protect, authorize('admin'), validateCoupon, createCoupon).get(protect, authorize('admin'), getCoupons);
router.post('/apply', protect, applyCoupon);
router.route('/:id').put(protect, authorize('admin'), updateCoupon).delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;
