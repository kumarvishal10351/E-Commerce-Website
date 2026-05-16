/**
 * Shopping cart page. Shows items in the cart and checkout options.
 *
 * This file renders the page UI and handles page-specific state, effects, and user actions.
 */

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiMinus, HiPlus, HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';
import { removeFromCart, updateQuantity, clearCart, applyDiscount } from '../store/slices/cartSlice';
import { applyCouponAPI } from '../store/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Cart = () => {
  // SECTION: Redux
  const dispatch = useDispatch();
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice, discount, couponCode } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);

  // SECTION: State
  const [coupon, setCoupon] = useState('');
  const [applying, setApplying] = useState(false);

  // SECTION: Handlers
  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplying(true);
    try {
      const res = await applyCouponAPI({ code: coupon, totalAmount: itemsPrice });
      dispatch(applyDiscount({ discount: res.data.discount, couponCode: res.data.couponCode }));
      toast.success(`Coupon applied! You save $${res.data.discount.toFixed(2)}`);
      setCoupon('');
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
    finally { setApplying(false); }
  };

  // SECTION: JSX — empty cart
  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <HiOutlineShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">Looks like you haven't added anything yet</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">Start Shopping <HiOutlineArrowRight /></Link>
      </motion.div>
    </div>
  );

  // SECTION: JSX
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart ({items.length})</h1>
        <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear Cart</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item.product} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="card p-4 md:p-6">
                <div className="flex gap-4">
                  <Link to={`/product/${item.product}`} className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-900 flex-shrink-0">
                    <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="font-semibold text-sm md:text-base hover:text-primary-500 transition-colors line-clamp-2">{item.name}</Link>
                    <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => dispatch(updateQuantity({ product: item.product, quantity: Math.max(1, item.quantity - 1) }))} className="p-2 hover:bg-gray-100 dark:hover:bg-navy-900"><HiMinus className="w-3 h-3" /></button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ product: item.product, quantity: Math.min(item.stock, item.quantity + 1) }))} className="p-2 hover:bg-gray-100 dark:hover:bg-navy-900"><HiPlus className="w-3 h-3" /></button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => { dispatch(removeFromCart(item.product)); toast.success('Removed from cart'); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <h3 className="font-bold text-lg">Order Summary</h3>
            {/* Coupon */}
            <div className="flex gap-2">
              <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="input-field !py-2 text-sm flex-1" />
              <button onClick={handleApplyCoupon} disabled={applying} className="px-4 py-2 bg-navy-800 dark:bg-white text-white dark:text-navy-800 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">{applying ? '...' : 'Apply'}</button>
            </div>
            {couponCode && <p className="text-sm text-green-600 flex items-center gap-1">✓ Coupon <strong>{couponCode}</strong> applied</p>}
            <hr />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Subtotal</span><span className="font-medium">${itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Shipping</span><span className="font-medium">{shippingPrice === 0 ? <span className="text-green-500">FREE</span> : `$${shippingPrice.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Tax (8%)</span><span className="font-medium">${taxPrice.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
              <hr />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            </div>
            {shippingPrice > 0 && <p className="text-xs text-[var(--color-text-secondary)]">Add ${(100 - itemsPrice).toFixed(2)} more for free shipping!</p>}
            {isAuthenticated ? (
              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">Proceed to Checkout <HiOutlineArrowRight /></Link>
            ) : (
              <Link to="/login?redirect=checkout" className="btn-primary w-full text-center block">Login to Checkout</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
