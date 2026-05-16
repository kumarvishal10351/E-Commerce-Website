import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineSearch, HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineCog, HiOutlineClipboardList, HiOutlineViewGrid } from 'react-icons/hi';
import { toggleSidebar, closeSidebar, openCart, resetCartBounce } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { CATEGORIES } from '../../data/products';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarOpen, cartBounce } = useSelector((s) => s.ui);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { totalItems } = useSelector((s) => s.cart);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);
  const { direction, isScrolled } = useScrollDirection();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (cartBounce) {
      const t = setTimeout(() => dispatch(resetCartBounce()), 600);
      return () => clearTimeout(t);
    }
  }, [cartBounce, dispatch]);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const hidden = direction === 'down' && isScrolled;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${hidden ? '-translate-y-full' : 'translate-y-0'} ${isScrolled ? 'glass-card !rounded-none border-b border-white/10 backdrop-blur-xl bg-luxury-bg/80' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button type="button" onClick={() => dispatch(toggleSidebar())} className="md:hidden p-2 rounded-lg hover:bg-white/5" aria-label="Menu">
              {sidebarOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-gradient-luxury flex items-center justify-center font-serif font-bold text-lg">L</span>
              <span className="text-xl font-serif font-bold hidden sm:block">LUXE</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm hover:text-luxury-gold transition-colors">Home</Link>
              <div className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
                <button type="button" className="text-sm hover:text-luxury-gold transition-colors">Shop</button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[480px]">
                      <div className="glass-card p-6 grid grid-cols-2 gap-3">
                        {CATEGORIES.map((c) => (
                          <Link key={c.slug} to={`/products?category=${c.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5">
                            <img src={c.image} alt="" className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                            <span><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-luxury-muted">{c.emoji}</p></span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/products?isFeatured=true" className="text-sm hover:text-luxury-gold transition-colors">Featured</Link>
            </nav>
            <form onSubmit={handleSearch} className={`hidden md:flex flex-1 max-w-sm mx-6 transition-all duration-300 ${searchFocused ? 'max-w-md' : ''}`}>
              <div className="relative w-full">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
                <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Search products..." className="w-full pl-12 pr-4 py-2.5 bg-luxury-surface/80 border border-white/10 rounded-xl text-sm outline-none focus:border-luxury-purple" />
              </div>
            </form>
            <div className="flex items-center gap-1">
              <Link to="/wishlist" className="p-2.5 rounded-xl hover:bg-white/5 relative hidden sm:block" aria-label="Wishlist">
                <HiOutlineHeart className="w-5 h-5" />
                {wishlistItems.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-luxury-purple text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistItems.length}</span>}
              </Link>
              <button type="button" onClick={() => dispatch(openCart())} className="p-2.5 rounded-xl hover:bg-white/5 relative" aria-label="Cart">
                <motion.span animate={cartBounce ? { scale: [1, 1.4, 1] } : {}}><HiOutlineShoppingBag className="w-5 h-5" /></motion.span>
                {totalItems > 0 && <span className="absolute top-1 right-1 w-5 h-5 bg-luxury-gold text-luxury-bg text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
              </button>
              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={menuRef}>
                  <button type="button" onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 rounded-xl hover:bg-white/5">
                    <span className="w-8 h-8 rounded-lg bg-gradient-luxury flex items-center justify-center text-sm font-bold">{user?.name?.[0]}</span>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-2 w-52 glass-card p-2">
                        <p className="px-3 py-2 text-sm border-b border-white/10">{user?.name}</p>
                        <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 rounded-lg"><HiOutlineCog className="w-4 h-4" /> Profile</Link>
                        <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 rounded-lg"><HiOutlineClipboardList className="w-4 h-4" /> Orders</Link>
                        {user?.role === 'admin' && <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-luxury-gold hover:bg-white/5 rounded-lg"><HiOutlineViewGrid className="w-4 h-4" /> Admin</Link>}
                        <button type="button" onClick={() => { dispatch(logout()); setShowUserMenu(false); }} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 w-full"><HiOutlineLogout className="w-4 h-4" /> Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block btn-gradient !px-4 !py-2 text-sm ml-1">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => dispatch(closeSidebar())} className="fixed inset-0 bg-black/70 z-40 md:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 bottom-0 w-80 glass-card z-50 p-6 md:hidden rounded-none">
              <div className="flex justify-between mb-8">
                <span className="font-serif text-2xl font-bold">LUXE</span>
                <button type="button" onClick={() => dispatch(closeSidebar())}><HiOutlineX className="w-6 h-6" /></button>
              </div>
              <form onSubmit={(e) => { handleSearch(e); dispatch(closeSidebar()); }} className="mb-6">
                <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="input-luxury w-full" />
              </form>
              <nav className="space-y-1">
                {['/', '/products', '/cart', '/wishlist', '/orders', '/profile'].map((to, i) => (
                  <Link key={to} to={to} onClick={() => dispatch(closeSidebar())} className="block px-4 py-3 rounded-xl hover:bg-white/5">{['Home', 'Products', 'Cart', 'Wishlist', 'Orders', 'Profile'][i]}</Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Header;
