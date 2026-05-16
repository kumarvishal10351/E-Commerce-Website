import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineEye } from 'react-icons/hi';
import Skeleton from '../components/ui/Skeleton';
import { getMyOrdersAPI } from '../store/api';

const statusColors = { Processing: 'badge-warning', Confirmed: 'badge-info', Shipped: 'badge-info', 'Out for Delivery': 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-error', Refunded: 'badge-error' };

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await getMyOrdersAPI(); setOrders(res.data.orders); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">{Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}</div>;

  if (orders.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <HiOutlineClipboardList className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
      <h2 className="text-2xl font-bold mb-3">No orders yet</h2>
      <p className="text-[var(--color-text-secondary)] mb-8">Start shopping to see your orders here</p>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order, i) => (
          <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={`/orders/${order._id}`} className="card p-5 block hover:shadow-lg transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                  <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
                  <HiOutlineEye className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {order.orderItems.slice(0, 4).map((item, idx) => (
                  <img key={idx} src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                ))}
                {order.orderItems.length > 4 && <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-navy-900 flex items-center justify-center text-xs font-bold">+{order.orderItems.length - 4}</div>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
