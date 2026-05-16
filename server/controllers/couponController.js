const Coupon = require('../models/Coupon');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({ success: true, coupons });
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  const { code, totalAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) return next(new ErrorResponse('Invalid coupon code', 404));
  const validity = coupon.isValid();
  if (!validity.valid) return next(new ErrorResponse(validity.message, 400));
  const { discount, message } = coupon.calculateDiscount(totalAmount);
  if (discount === 0) return next(new ErrorResponse(message, 400));
  res.status(200).json({ success: true, discount, message, couponCode: coupon.code });
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new ErrorResponse('Coupon not found', 404));
  await coupon.deleteOne();
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});

const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) return next(new ErrorResponse('Coupon not found', 404));
  res.status(200).json({ success: true, coupon });
});

module.exports = { createCoupon, getCoupons, applyCoupon, deleteCoupon, updateCoupon };
