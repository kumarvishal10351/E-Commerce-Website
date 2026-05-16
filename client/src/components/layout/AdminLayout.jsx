// SECTION: Imports — admin shell with sidebar nav and nested <Outlet /> pages
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineClipboardList, HiOutlineUsers, HiOutlineTag, HiOutlineCollection, HiOutlineArrowLeft } from 'react-icons/hi';

// SECTION: Admin nav routes — dashboard, catalog, orders, users, coupons, categories
const links = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineViewGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: HiOutlineCube },
  { to: '/admin/orders', label: 'Orders', icon: HiOutlineClipboardList },
  { to: '/admin/users', label: 'Users', icon: HiOutlineUsers },
  { to: '/admin/coupons', label: 'Coupons', icon: HiOutlineTag },
  { to: '/admin/categories', label: 'Categories', icon: HiOutlineCollection },
];

const AdminLayout = () => {
  const { user } = useSelector(s => s.auth);
  // SECTION: Auth guard — non-admins redirect to storefront home
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex gap-6">
        {/* SECTION: Desktop sidebar — sticky nav with active link styling */}
        <aside className="hidden md:block w-60 flex-shrink-0">
          <div className="card p-4 sticky top-24 space-y-1">
            <div className="px-4 py-3 mb-2"><h2 className="font-bold text-lg">Admin Panel</h2><p className="text-xs text-[var(--color-text-secondary)]">{user.email}</p></div>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'hover:bg-gray-50 dark:hover:bg-navy-900'}`}>
                <l.icon className="w-5 h-5" /> {l.label}
              </NavLink>
            ))}
            <hr className="my-2" />
            <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-navy-900"><HiOutlineArrowLeft className="w-5 h-5" /> Back to Store</NavLink>
          </div>
        </aside>

        {/* SECTION: Mobile nav — horizontal scroll tabs for small screens */}
        <div className="md:hidden w-full overflow-x-auto mb-4">
          <div className="flex gap-2 pb-2">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-navy-900'}`}>
                <l.icon className="w-4 h-4" /> {l.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* SECTION: Page content — child admin routes render here via Outlet */}
        <main className="flex-1 min-w-0"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
