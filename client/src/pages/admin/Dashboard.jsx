import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineCube, HiOutlineTrendingUp } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Skeleton from '../../components/ui/Skeleton';
import { getDashboardStatsAPI } from '../../store/api';

const COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await getDashboardStatsAPI(); setStats(res.data.stats); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-6"><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-32 rounded-2xl" />)}</div><Skeleton className="h-80 rounded-2xl" /></div>;

  const revenueData = stats?.monthlyRevenue?.map(m => ({ name: months[m._id.month - 1], revenue: m.revenue, orders: m.orders })) || [];
  const statusData = stats?.ordersByStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  const statCards = [
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: 'from-green-400 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: HiOutlineShoppingBag, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: HiOutlineUsers, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: HiOutlineCube, color: 'from-primary-400 to-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-6 h-6 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`} style={{ color: s.color.includes('green') ? '#22c55e' : s.color.includes('blue') ? '#3b82f6' : s.color.includes('purple') ? '#8b5cf6' : '#f59e0b' }} />
              </div>
              <HiOutlineTrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-bold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">{statusData.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /><span>{s.name}</span></div>
              <span className="font-medium">{s.value}</span>
            </div>
          ))}</div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats?.recentOrders?.map(order => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div><p className="font-mono text-sm font-bold">#{order._id.slice(-8).toUpperCase()}</p><p className="text-xs text-[var(--color-text-secondary)]">{order.user?.name}</p></div>
                <div className="text-right"><p className="font-bold">${order.totalPrice.toFixed(2)}</p><span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-success' : order.orderStatus === 'Cancelled' ? 'badge-error' : 'badge-warning'}`}>{order.orderStatus}</span></div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">No orders yet</p>}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {stats?.topProducts?.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="text-sm font-bold text-[var(--color-text-secondary)] w-6">{i + 1}.</span>
                <img src={p.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.name}</p><p className="text-xs text-[var(--color-text-secondary)]">{p.totalSold} sold</p></div>
              </div>
            ))}
            {(!stats?.topProducts || stats.topProducts.length === 0) && <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
