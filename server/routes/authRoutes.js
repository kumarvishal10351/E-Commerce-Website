/**
 * SECTION: Auth routes — mounted at /api/auth
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { register, login, logout, getMe, updateProfile, updatePassword, updateAddress, deleteAddress, forgotPassword, resetPassword, toggleWishlist, getWishlist } = require('../controllers/authController');

// ─── Public: register & login ───
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);

// ─── Private: session & profile ───
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/address', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

// ─── Public: password reset ───
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);

// ─── Private: wishlist ───
router.put('/wishlist/:productId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
