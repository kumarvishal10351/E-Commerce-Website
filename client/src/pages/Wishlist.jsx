import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiOutlineTrash, HiOutlineShoppingBag } from 'react-icons/hi';
import { removeWishlistItem } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  // SECTION: Redux
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.wishlist);

  // SECTION: JSX — empty wishlist
  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <HiOutlineHeart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">Save items you love for later</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </motion.div>
    </div>
  );

  // SECTION: JSX
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.product} layout exit={{ opacity: 0, scale: 0.8 }} className="card card-hover overflow-hidden">
              <Link to={`/product/${item.product}`} className="block">
                <div className="aspect-square bg-gray-100 dark:bg-navy-900 overflow-hidden">
                  <img src={item.image || 'https://via.placeholder.com/300'} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{item.name}</h3>
                  <p className="text-lg font-bold">${item.price?.toFixed(2)}</p>
                </div>
              </Link>
              <div className="px-4 pb-4 flex gap-2">
                <button onClick={() => { dispatch(addToCart({ product: item.product, name: item.name, price: item.price, image: item.image, stock: 99, quantity: 1 })); toast.success('Added to cart!'); }} className="btn-primary flex-1 !py-2 text-sm flex items-center justify-center gap-1">
                  <HiOutlineShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button onClick={() => { dispatch(removeWishlistItem(item.product)); toast.success('Removed'); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
