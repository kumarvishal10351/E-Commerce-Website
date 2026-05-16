/**
 * SECTION: Order routes — mounted at /api/orders
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');

// ─── Admin: dashboard stats ───
router.get('/admin/stats', protect, authorize('admin'), getDashboardStats);

// ─── Customer: my orders ───
router.get('/myorders', protect, getMyOrders);

// ─── Create order (user) / list all (admin) ───
router.route('/').post(protect, createOrder).get(protect, authorize('admin'), getAllOrders);

// ─── Single order & admin status update ───
router.route('/:id').get(protect, getOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
