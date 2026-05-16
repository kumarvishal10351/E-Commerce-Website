const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const sendTokenResponse = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { welcomeEmail, resetPasswordEmail } = require('../utils/emailTemplates');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('An account with this email already exists', 400));
  }

  const user = await User.create({ name, email, password });

  // Send welcome email (non-blocking)
  try {
    await sendEmail({
      email: user.email,
      subject: 'Welcome to ShopVerse! 🛍️',
      html: welcomeEmail(user.name),
    });
  } catch (err) {
    console.error('Welcome email failed:', err.message);
  }

  sendTokenResponse(user, 201, res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  if (user.isBlocked) {
    return next(new ErrorResponse('Your account has been blocked. Contact support.', 403));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name price images');
  res.status(200).json({ success: true, user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar) {
    fieldsToUpdate.avatar = req.body.avatar;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Add/update user address
 * @route   PUT /api/auth/address
 * @access  Private
 */
const updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  if (req.body._id) {
    // Update existing address
    const idx = user.addresses.findIndex((a) => a._id.toString() === req.body._id);
    if (idx !== -1) {
      user.addresses[idx] = { ...user.addresses[idx].toObject(), ...req.body };
    }
  } else {
    // Add new address
    if (user.addresses.length === 0) req.body.isDefault = true;
    user.addresses.push(req.body);
  }

  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

/**
 * @desc    Delete user address
 * @route   DELETE /api/auth/address/:addressId
 * @access  Private
 */
const deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

/**
 * @desc    Forgot password — send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('No account found with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset — ShopVerse',
      html: resetPasswordEmail(user.name, resetUrl),
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset token', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Toggle product in wishlist
 * @route   PUT /api/auth/wishlist/:productId
 * @access  Private
 */
const toggleWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const productId = req.params.productId;

  const index = user.wishlist.indexOf(productId);
  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

/**
 * @desc    Get wishlist
 * @route   GET /api/auth/wishlist
 * @access  Private
 */
const getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  updateAddress,
  deleteAddress,
  forgotPassword,
  resetPassword,
  toggleWishlist,
  getWishlist,
};
