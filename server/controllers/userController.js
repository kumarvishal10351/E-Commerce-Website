/**
 * SECTION: User controller (admin)
 * List users, change roles, block/unblock, and delete accounts.
 */

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// ─── List & get user ───
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const totalUsers = await User.countDocuments();
  const users = await User.find().sort('-createdAt').skip((page - 1) * limit).limit(limit);
  res.status(200).json({ success: true, count: users.length, totalUsers, totalPages: Math.ceil(totalUsers / limit), currentPage: page, users });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  res.status(200).json({ success: true, user });
});

// ─── Role, block, delete ───
const updateUserRole = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true });
  if (!user) return next(new ErrorResponse('User not found', 404));
  res.status(200).json({ success: true, user });
});

const toggleBlockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  user.isBlocked = !user.isBlocked;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, user, message: user.isBlocked ? 'User blocked' : 'User unblocked' });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted' });
});

module.exports = { getAllUsers, getUser, updateUserRole, toggleBlockUser, deleteUser };
