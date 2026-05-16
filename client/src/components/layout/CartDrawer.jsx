// SECTION: Imports — Redux cart slice; slide-in panel with line items and totals
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineMinus, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { closeCart } from '../../store/slices/uiSlice';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { formatINR } from '../../utils/format';
import Button from '../ui/Button';

/**
 * Slide-in cart drawer with blur overlay
 */
const CartDrawer = () => {
  // SECTION: Redux state — drawer visibility and cart pricing breakdown
  const dispatch = useDispatch();
  const { cartOpen } = useSelector((s) => s.ui);
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((s) => s.cart);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* SECTION: Backdrop — click outside closes drawer */}
          <div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => dispatch(closeCart())} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" />
          {/* SECTION: Drawer panel — header, scrollable items, checkout footer */}
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-card z-[81] flex flex-col border-l border-white/10 rounded-none">
            <header className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-serif text-xl">Your Bag ({items.length})</h2>
              <button type="button" onClick={() => dispatch(closeCart())} className="p-2 rounded-lg hover:bg-white/5" aria-label="Close cart"><HiOutlineX className="w-5 h-5" /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <p className="text-luxury-muted text-center py-12">Your bag is empty</p>
              ) : items.map((item) => (
                <div key={item.product} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 glass-card p-3">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                    <p className="text-luxury-gold font-accent font-semibold mt-1">{formatINR(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button type="button" onClick={() => dispatch(updateQuantity({ product: item.product, quantity: Math.max(1, item.quantity - 1) }))} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><HiOutlineMinus className="w-4 h-4" /></button>
                      <span className="w-8 text-center font-accent">{item.quantity}</span>
                      <button type="button" onClick={() => dispatch(updateQuantity({ product: item.product, quantity: Math.min(item.stock, item.quantity + 1) }))} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><HiOutlinePlus className="w-4 h-4" /></button>
                      <button type="button" onClick={() => dispatch(removeFromCart(item.product))} className="ml-auto p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <footer className="p-5 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm text-luxury-muted"><span>Subtotal</span><span>{formatINR(itemsPrice)}</span></div>
                <div className="flex justify-between text-sm text-luxury-muted"><span>Shipping</span><span>{shippingPrice === 0 ? 'FREE' : formatINR(shippingPrice)}</span></div>
                <div className="flex justify-between text-sm text-luxury-muted"><span>GST (18%)</span><span>{formatINR(taxPrice)}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10"><span>Total</span><span className="text-luxury-gold">{formatINR(totalPrice)}</span></div>
                <Link to="/checkout" onClick={() => dispatch(closeCart())}><Button className="w-full">Checkout</Button></Link>
                <Link to="/cart" onClick={() => dispatch(closeCart())} className="block text-center text-sm text-luxury-muted hover:text-white">View full cart</Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
