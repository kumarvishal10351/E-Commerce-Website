/**
 * SECTION: Order controller
 * Checkout, order history, admin fulfillment, and dashboard analytics.
 */

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');
const { orderConfirmationEmail, orderStatusEmail } = require('../utils/emailTemplates');

// ─── Create order (stock check, confirmation email) ───
const createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, discountAmount, couponCode } = req.body;
  if (!orderItems || orderItems.length === 0) return next(new ErrorResponse('No order items', 400));
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) return next(new ErrorResponse(`Product not found: ${item.name}`, 404));
    if (product.stock < item.quantity) return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
  }
  const order = await Order.create({ user: req.user.id, orderItems, shippingAddress, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, discountAmount: discountAmount || 0, couponCode });
  for (const item of orderItems) { await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }); }
  try { const user = await User.findById(req.user.id); await sendEmail({ email: user.email, subject: `Order Confirmed — ShopVerse`, html: orderConfirmationEmail(user.name, order) }); } catch (err) { console.error('Order email failed:', err.message); }
  res.status(201).json({ success: true, order });
});

// ─── Customer: my orders & single order ───
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, orders });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return next(new ErrorResponse('Order not found', 404));
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') return next(new ErrorResponse('Not authorized', 403));
  res.status(200).json({ success: true, order });
});

// ─── Admin: list orders & update status ───
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  let filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  const totalOrders = await Order.countDocuments(filter);
  const orders = await Order.find(filter).populate('user', 'name email').sort('-createdAt').skip((page - 1) * limit).limit(limit);
  res.status(200).json({ success: true, count: orders.length, totalOrders, totalPages: Math.ceil(totalOrders / limit), currentPage: page, orders });
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse('Order not found', 404));
  if (order.orderStatus === 'Delivered') return next(new ErrorResponse('Already delivered', 400));
  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') order.deliveredAt = Date.now();
  if (req.body.status === 'Cancelled') { order.cancelledAt = Date.now(); for (const item of order.orderItems) { await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }); } }
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  await order.save();
  try { const user = await User.findById(order.user); if (user) await sendEmail({ email: user.email, subject: `Order Update — ShopVerse`, html: orderStatusEmail(user.name, order._id, req.body.status) }); } catch (err) { console.error('Email failed:', err.message); }
  res.status(200).json({ success: true, order });
});

// ─── Admin: revenue & order analytics ───
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalUsers, totalProducts] = await Promise.all([Order.countDocuments(), User.countDocuments(), Product.countDocuments()]);
  const revenueResult = await Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
  const monthlyRevenue = await Order.aggregate([{ $match: { createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }, orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }]);
  const ordersByStatus = await Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]);
  const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(5);
  const topProducts = await Order.aggregate([{ $unwind: '$orderItems' }, { $group: { _id: '$orderItems.product', totalSold: { $sum: '$orderItems.quantity' }, name: { $first: '$orderItems.name' }, image: { $first: '$orderItems.image' } } }, { $sort: { totalSold: -1 } }, { $limit: 5 }]);
  res.status(200).json({ success: true, stats: { totalOrders, totalUsers, totalProducts, totalRevenue, monthlyRevenue, ordersByStatus, recentOrders, topProducts } });
});

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getDashboardStats };
