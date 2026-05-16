/**
 * SECTION: Authentication & authorization middleware
 * Verifies JWT tokens and restricts routes to specific user roles.
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// ─── protect — require logged-in user ───
/**
 * Protect routes — require valid JWT token.
 * Token can be in cookies or Authorization header.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies first, then Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route. Please log in.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (user.isBlocked) {
      return next(new ErrorResponse('Your account has been blocked. Contact support.', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// ─── authorize — restrict by role (e.g. admin) ───
/**
 * Authorize specific roles (e.g., 'admin').
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`Role '${req.user.role}' is not authorized to access this route`, 403));
    }
    next();
  };
};

module.exports = { protect, authorize };
