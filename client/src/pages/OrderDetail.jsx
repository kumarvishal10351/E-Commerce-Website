import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheck, HiOutlineTruck, HiOutlineClipboardCheck, HiOutlineCube, HiOutlineHome } from 'react-icons/hi';
import Skeleton from '../components/ui/Skeleton';
import { getOrderAPI } from '../store/api';

const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
const stepIcons = [HiOutlineClipboardCheck, HiCheck, HiOutlineCube, HiOutlineTruck, HiOutlineHome];

const OrderDetail = () => {
  // SECTION: Router & state
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // SECTION: Effects
  useEffect(() => {
    const fetch = async () => {
      try { const res = await getOrderAPI(id); setOrder(res.data.order); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  // SECTION: JSX — loading
  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-48 w-full rounded-2xl" /><Skeleton className="h-64 w-full rounded-2xl" /></div>;
  if (!order) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Order not found</h2></div>;

  // SECTION: Derived
  const currentStep = statusSteps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled' || order.orderStatus === 'Refunded';

  // SECTION: JSX
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/orders" className="text-sm text-primary-500 hover:underline mb-2 block">← Back to orders</Link>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold mb-6">Order Status</h3>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => {
              const Icon = stepIcons[i];
              const isActive = i <= currentStep;
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isActive ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center ${isActive ? 'font-medium' : 'text-[var(--color-text-secondary)]'}`}>{step}</span>
                  {i < statusSteps.length - 1 && <div className={`absolute h-0.5 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && <div className="card p-6 mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"><p className="text-red-600 font-bold">Order {order.orderStatus}</p></div>}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 card p-6">
          <h3 className="font-bold mb-4">Items</h3>
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
              <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product}`} className="font-medium text-sm hover:text-primary-500 truncate block">{item.name}</Link>
                <p className="text-xs text-[var(--color-text-secondary)]">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
              <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3">Shipping</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">{order.shippingAddress.fullName}<br />{order.shippingAddress.addressLine1}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          </div>
          <div className="card p-5">
            <h3 className="font-bold mb-3">Payment</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discountAmount.toFixed(2)}</span></div>}
              <hr />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
