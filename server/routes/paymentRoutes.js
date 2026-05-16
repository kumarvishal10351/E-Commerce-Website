/**
 * SECTION: Payment routes — mounted at /api/payment
 * Stripe PaymentIntent for checkout and webhook for payment confirmation.
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');

// ─── Checkout: create Stripe PaymentIntent ───
router.post('/create-intent', protect, createPaymentIntent);

// ─── Stripe webhook (raw body; also configured in server.js) ───
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
