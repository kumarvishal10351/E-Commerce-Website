/**
 * SECTION: Rate limiting
 * Throttles API and auth endpoints to reduce abuse and brute-force attempts.
 */

const rateLimit = require('express-rate-limit');

// ─── apiLimiter — general /api traffic ───
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── authLimiter — login/register/forgot-password ───
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter };
