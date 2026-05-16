// SECTION: Imports — cart/wishlist Redux, scroll-in animation, pricing helpers
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { HiOutlineShoppingBag, HiOutlineHeart } from 'react-icons/hi';
import { addToCart } from '../../store/slices/cartSlice';
import { openCart, triggerCartBounce } from '../../store/slices/uiSlice';
import { toggleWishlistItem } from '../../store/slices/wishlistSlice';
import { formatINR } from '../../utils/format';
import { getDiscount, getStockBadge } from '../../data/products';
import Badge from './Badge';
import Rating from './Rating';
import toast from 'react-hot-toast';
import { prefersReducedMotion } from '../../utils/motion';

/** Premium product card with dual-image hover swap */
const ProductCard = ({ product, index = 0 }) => {
  // SECTION: Hooks & Redux — hover state, scroll reveal, wishlist membership
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { items: wishlistItems } = useSelector((s) => s.wishlist);
  // SECTION: Derived product data — id, images, discount %, stock badge label
  const id = product._id || product.id;
  const isWishlisted = wishlistItems.some((i) => i.product === id);
  const price = product.price;
  const comparePrice = product.comparePrice || product.mrp;
  const discount = getDiscount(price, comparePrice);
  const stockBadge = getStockBadge(product.stock ?? 0);
  const img1 = product.images?.[0]?.url || product.image;
  const img2 = product.images?.[1]?.url || product.imageHover || img1;

  // SECTION: Handlers — add to cart (opens drawer) and toggle wishlist; stop link navigation
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.stock ?? 0) < 1) return toast.error('Out of stock');
    dispatch(addToCart({ product: id, name: product.name, price, image: img1, stock: product.stock, quantity: 1 }));
    dispatch(triggerCartBounce());
    dispatch(openCart());
    toast.success('Added to cart');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem({ product: id, name: product.name, price, image: img1 }));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const stockVariant = stockBadge.type === 'warning' ? 'warning' : stockBadge.type === 'danger' ? 'discount' : 'stock';

  // SECTION: Render — linked card with image swap, badges, quick actions, price
  return (
    <motion.article
      ref={ref}
      initial={prefersReducedMotion() ? {} : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/product/${id}`}
        className="group block glass-card img-zoom-hover overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* SECTION: Image area — dual hover swap, discount/stock badges, wishlist + cart CTA */}
        <figure className="relative aspect-square overflow-hidden bg-luxury-surface m-0">
          <img src={img1} alt={product.name} loading="lazy" className={`img-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`} />
          <img src={img2} alt="" loading="lazy" aria-hidden className={`img-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
          {discount > 0 && <Badge variant="discount" className="absolute top-3 left-3 z-10">{discount}% OFF</Badge>}
          <Badge variant={stockVariant} className="absolute top-3 right-3 z-10">{stockBadge.label}</Badge>
          <button type="button" onClick={handleWishlist} className={`absolute top-12 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500'}`} aria-label="Wishlist">
            <HiOutlineHeart className="w-4 h-4" />
          </button>
          <motion.div className="absolute inset-x-3 bottom-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button type="button" onClick={handleAddToCart} disabled={(product.stock ?? 0) < 1} className="w-full btn-gradient !py-2.5 !text-sm flex items-center justify-center gap-2 disabled:opacity-40">
              <HiOutlineShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
          </motion.div>
        </figure>
        {/* SECTION: Product info — brand, title, rating, animated price */}
        <section className="p-4">
          <p className="text-xs font-accent text-luxury-gold tracking-wider uppercase mb-1">{product.brand}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-luxury-glow transition-colors">{product.name}</h3>
          <Rating value={product.ratingsAverage || product.rating} count={product.ratingsCount || product.reviewCount} />
          <p className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold font-accent">
              {inView && !prefersReducedMotion() ? <CountUp end={price} duration={1.2} separator="," prefix="₹" /> : formatINR(price)}
            </span>
            {comparePrice > price && <span className="text-sm text-luxury-muted line-through">{formatINR(comparePrice)}</span>}
          </p>
        </section>
      </Link>
    </motion.article>
  );
};

export default ProductCard;
