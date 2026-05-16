/**
 * SECTION: Payment controller (Stripe)
 * PaymentIntent for client checkout and webhook to confirm orders.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Order = require('../models/Order');

// ─── createPaymentIntent — client secret for Stripe Elements ───
const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return next(new ErrorResponse('Invalid payment amount', 400));
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    metadata: { userId: req.user.id },
  });
  res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
});

// ─── handleWebhook — verify signature & update order on success ───
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Order.findOneAndUpdate(
      { 'paymentInfo.id': paymentIntent.id },
      { 'paymentInfo.status': 'succeeded', orderStatus: 'Confirmed' }
    );
  }
  res.status(200).json({ received: true });
});

module.exports = { createPaymentIntent, handleWebhook };
