const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');

router.get('/admin/stats', protect, authorize('admin'), getDashboardStats);
router.get('/myorders', protect, getMyOrders);
router.route('/').post(protect, createOrder).get(protect, authorize('admin'), getAllOrders);
router.route('/:id').get(protect, getOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
