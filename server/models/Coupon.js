/**
 * SECTION: Coupon model
 * Discount codes with expiry, usage limits, and percent/fixed calculation helpers.
 */

const mongoose = require('mongoose');

// ─── Coupon schema ───
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide a coupon code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percent', 'fixed'],
      required: [true, 'Please specify discount type'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Please provide discount value'],
      min: [0, 'Discount value cannot be negative'],
    },
    minPurchase: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please provide an expiry date'],
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Instance methods ───
// Check if coupon is valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return { valid: false, message: 'Coupon is not active' };
  if (this.expiryDate < new Date()) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit)
    return { valid: false, message: 'Coupon usage limit reached' };
  return { valid: true };
};

// Calculate discount
couponSchema.methods.calculateDiscount = function (totalAmount) {
  if (totalAmount < this.minPurchase) {
    return { discount: 0, message: `Minimum purchase of $${this.minPurchase} required` };
  }

  let discount;
  if (this.discountType === 'percent') {
    discount = (totalAmount * this.discountValue) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.discountValue;
  }

  return { discount: Math.min(discount, totalAmount), message: 'Coupon applied successfully' };
};

module.exports = mongoose.model('Coupon', couponSchema);
