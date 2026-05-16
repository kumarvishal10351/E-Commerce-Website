import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { openCart } from '../../store/slices/uiSlice';

const MobileNav = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { totalItems } = useSelector((s) => s.cart);
  const links = [
    { to: '/', icon: HiOutlineHome, label: 'Home' },
    { to: '/search', icon: HiOutlineSearch, label: 'Search' },
    { to: null, icon: HiOutlineShoppingBag, label: 'Cart', onClick: () => dispatch(openCart()) },
    { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-card !rounded-none border-t border-white/10 pb-safe">
      <div className="flex justify-around py-2">
        {links.map(({ to, icon: Icon, label, onClick }) =>
          onClick ? (
            <button key={label} type="button" onClick={onClick} className="flex flex-col items-center p-2 min-w-[44px] text-luxury-muted">
              <span className="relative"><Icon className="w-6 h-6" />{totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-gold text-[9px] text-luxury-bg rounded-full flex items-center justify-center">{totalItems}</span>}</span>
              <span className="text-[10px]">{label}</span>
            </button>
          ) : (
            <Link key={to} to={to} className={`flex flex-col items-center p-2 min-w-[44px] ${pathname === to ? 'text-luxury-gold' : 'text-luxury-muted'}`}>
              <Icon className="w-6 h-6" /><span className="text-[10px]">{label}</span>
            </Link>
          )
        )}
      </div>
    </nav>
  );
};
export default MobileNav;
