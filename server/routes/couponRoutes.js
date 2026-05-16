/**
 * SECTION: Coupon routes — mounted at /api/coupons
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateCoupon } = require('../middleware/validate');
const { createCoupon, getCoupons, applyCoupon, deleteCoupon, updateCoupon } = require('../controllers/couponController');

// ─── Admin: CRUD coupon codes ───
router.route('/').post(protect, authorize('admin'), validateCoupon, createCoupon).get(protect, authorize('admin'), getCoupons);

// ─── Customer: apply code at checkout ───
router.post('/apply', protect, applyCoupon);

// ─── Admin: update/delete by ID ───
router.route('/:id').put(protect, authorize('admin'), updateCoupon).delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;
