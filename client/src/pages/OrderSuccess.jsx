import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineClipboardList } from 'react-icons/hi';

const OrderSuccess = () => {
  const { id } = useParams();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiOutlineCheckCircle className="w-14 h-14 text-green-500" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-3xl font-bold mb-3">Order Placed! 🎉</h1>
        <p className="text-[var(--color-text-secondary)] mb-2">Thank you for your purchase</p>
        {id && <p className="text-sm text-[var(--color-text-secondary)] mb-8">Order ID: <span className="font-mono font-bold text-[var(--color-text)]">#{id.slice(-8).toUpperCase()}</span></p>}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={id ? `/orders/${id}` : '/orders'} className="btn-primary flex items-center justify-center gap-2"><HiOutlineClipboardList className="w-5 h-5" /> View Order</Link>
          <Link to="/products" className="btn-outline">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
