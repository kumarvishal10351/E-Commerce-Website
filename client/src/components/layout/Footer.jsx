// SECTION: Imports — footer links and contact icon
import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';

// SECTION: Site footer — brand blurb, shop/account links, support email, copyright
const Footer = () => (
  <footer className="border-t border-white/10 bg-luxury-surface/50 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
      {/* SECTION: Brand column */}
      <div className="col-span-2 md:col-span-1">
        <p className="font-serif text-2xl font-bold mb-3">LUXE</p>
        <p className="text-sm text-luxury-muted leading-relaxed">Premium curated commerce.</p>
      </div>
      {/* SECTION: Shop links */}
      <div>
        <h4 className="font-accent text-sm uppercase tracking-wider text-luxury-gold mb-4">Shop</h4>
        <ul className="space-y-2 text-sm text-luxury-muted">
          <li><Link to="/products" className="hover:text-white">All Products</Link></li>
          <li><Link to="/products?category=footwear" className="hover:text-white">Footwear</Link></li>
        </ul>
      </div>
      {/* SECTION: Account links */}
      <div>
        <h4 className="font-accent text-sm uppercase tracking-wider text-luxury-gold mb-4">Account</h4>
        <ul className="space-y-2 text-sm text-luxury-muted">
          <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
          <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
        </ul>
      </div>
      {/* SECTION: Contact */}
      <div>
        <p className="text-sm text-luxury-muted flex items-center gap-2"><HiOutlineMail className="w-4 h-4" /> support@luxe.shop</p>
      </div>
    </div>
    {/* SECTION: Copyright bar */}
    <p className="border-t border-white/5 py-6 text-center text-xs text-luxury-muted">© 2026 LUXE</p>
  </footer>
);
export default Footer;
