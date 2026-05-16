const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const createReview = asyncHandler(async (req, res, next) => {
  const { rating, title, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new ErrorResponse('Product not found', 404));
  const existing = await Review.findOne({ user: req.user.id, product: req.params.productId });
  if (existing) return next(new ErrorResponse('You have already reviewed this product', 400));
  const review = await Review.create({ user: req.user.id, product: req.params.productId, rating, title, comment });
  res.status(201).json({ success: true, review });
});

const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse('Review not found', 404));
  if (review.user.toString() !== req.user.id) return next(new ErrorResponse('Not authorized', 403));
  review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  await Review.calcAverageRating(review.product);
  res.status(200).json({ success: true, review });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse('Review not found', 404));
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') return next(new ErrorResponse('Not authorized', 403));
  const productId = review.product;
  await Review.findByIdAndDelete(req.params.id);
  await Review.calcAverageRating(productId);
  res.status(200).json({ success: true, message: 'Review deleted' });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar').sort('-createdAt');
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

module.exports = { createReview, updateReview, deleteReview, getProductReviews };
