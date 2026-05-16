/**
 * Admin order management page. Lets admins review and update orders.
 *
 * This file renders the page UI and handles page-specific state, effects, and user actions.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from '../../components/ui/Skeleton';
import { getAllOrdersAPI, updateOrderStatusAPI } from '../../store/api';
import toast from 'react-hot-toast';

const statusColors = { Processing: 'badge-warning', Confirmed: 'badge-info', Shipped: 'badge-info', 'Out for Delivery': 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-error', Refunded: 'badge-error' };
const statuses = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const OrdersList = () => {
  // SECTION: State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  // SECTION: Data fetching
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filter) params.status = filter;
      const res = await getAllOrdersAPI(params);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // SECTION: Effects
  useEffect(() => { fetchOrders(); }, [page, filter]);

  // SECTION: Handlers
  const handleStatusChange = async (id, status) => {
    try { await updateOrderStatusAPI(id, { status }); toast.success('Status updated'); fetchOrders(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  // SECTION: JSX
  return (
    <div className="space-y-6">
      {/* Header & status filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => { setFilter(''); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!filter ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-navy-900'}`}>All</button>
          {statuses.map(s => <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${filter === s ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-navy-900'}`}>{s}</button>)}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-navy-900">
              <tr>{['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? Array.from({length:5}).map((_,i) => <tr key={i}><td colSpan={7} className="p-4"><Skeleton className="h-10 w-full" /></td></tr>)
              : orders.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-[var(--color-text-secondary)]">No orders found</td></tr>
              : orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-navy-900/50">
                  <td className="px-4 py-3"><Link to={`/orders/${order._id}`} className="font-mono text-sm font-bold text-primary-500 hover:underline">#{order._id.slice(-8).toUpperCase()}</Link></td>
                  <td className="px-4 py-3"><p className="text-sm font-medium">{order.user?.name}</p><p className="text-xs text-[var(--color-text-secondary)]">{order.user?.email}</p></td>
                  <td className="px-4 py-3 text-sm">{order.orderItems.length}</td>
                  <td className="px-4 py-3 font-bold text-sm">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`badge ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={order.orderStatus} onChange={e => handleStatusChange(order._id, e.target.value)} className="text-xs border rounded-lg px-2 py-1 bg-transparent" disabled={order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && <div className="flex justify-center gap-2">{Array.from({length:totalPages},(_,i)=>i+1).map(p => <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl text-sm font-medium ${page === p ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-navy-900'}`}>{p}</button>)}</div>}
    </div>
  );
};

export default OrdersList;
