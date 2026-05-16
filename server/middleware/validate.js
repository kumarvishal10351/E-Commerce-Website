/**
 * SECTION: Request validation (express-validator)
 * Reusable validation chains for auth, products, reviews, and coupons.
 */

const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/ErrorResponse');

// ─── handleValidation — collect errors and pass to next() ───
/**
 * Middleware to check validation results.
 * Must be placed after express-validator checks.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new ErrorResponse(messages.join('. '), 400));
  }
  next();
};

// ─── Auth validation chains ───
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// ─── Product validation chain ───
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidation,
];

// ─── Review validation chain ───
const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required'),
  handleValidation,
];

// ─── Coupon validation chain ───
const validateCoupon = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('discountType').isIn(['percent', 'fixed']).withMessage('Discount type must be percent or fixed'),
  body('discountValue').isFloat({ min: 0 }).withMessage('Discount value must be positive'),
  body('expiryDate').isISO8601().withMessage('Please provide a valid expiry date'),
  handleValidation,
];

module.exports = {
  handleValidation,
  validateRegister,
  validateLogin,
  validateProduct,
  validateReview,
  validateCoupon,
};
