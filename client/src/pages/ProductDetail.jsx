import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineHeart, HiStar, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiMinus, HiPlus } from 'react-icons/hi';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlistItem } from '../store/slices/wishlistSlice';
import Rating from '../components/ui/Rating';
import ProductCard from '../components/ui/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import { getProductAPI, getRelatedProductsAPI, getProductReviewsAPI, createReviewAPI } from '../store/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  // SECTION: Router & Redux
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const { items: wishlistItems } = useSelector(s => s.wishlist);

  // SECTION: State
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const isWishlisted = wishlistItems.some(i => i.product === id);

  // SECTION: Effects
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [pRes, rRes, revRes] = await Promise.all([getProductAPI(id), getRelatedProductsAPI(id), getProductReviewsAPI(id)]);
        setProduct(pRes.data.product); setRelated(rRes.data.products); setReviews(revRes.data.reviews);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch(); setSelectedImage(0); setQuantity(1);
  }, [id]);

  // SECTION: Handlers
  const handleAddToCart = () => {
    if (!product || product.stock < 1) return toast.error('Out of stock');
    dispatch(addToCart({ product: product._id, name: product.name, price: product.price, image: product.images?.[0]?.url || '', stock: product.stock, quantity }));
    toast.success('Added to cart!');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      await createReviewAPI(id, reviewForm);
      toast.success('Review submitted!');
      const revRes = await getProductReviewsAPI(id);
      setReviews(revRes.data.reviews);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  // SECTION: JSX — loading
  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12"><Skeleton variant="image" className="aspect-square rounded-2xl" /><div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-1/3" /><Skeleton className="h-20 w-full" /><Skeleton variant="button" className="!w-full !h-14" /></div></div>
    </div>
  );

  if (!product) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Product not found</h2><Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link></div>;

  // SECTION: Derived
  const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  // SECTION: JSX
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-8">
        <Link to="/" className="hover:text-primary-500">Home</Link><span>/</span>
        <Link to="/products" className="hover:text-primary-500">Products</Link><span>/</span>
        <span className="text-[var(--color-text)] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-navy-900 mb-4">
            <img src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary-500' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-sm text-primary-500 font-medium mb-2">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-3">
              <Rating value={Math.round(product.ratingsAverage)} showCount count={product.ratingsCount} />
              <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.comparePrice > product.price && <>
              <span className="text-xl text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
              <span className="badge bg-red-100 text-red-600">-{discount}%</span>
            </>}
          </div>

          <p className="text-[var(--color-text-secondary)] leading-relaxed">{product.description}</p>

          {/* Quantity + Actions */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm">Quantity:</span>
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-gray-100 dark:hover:bg-navy-900"><HiMinus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 hover:bg-gray-100 dark:hover:bg-navy-900"><HiPlus className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={product.stock < 1} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                <HiOutlineShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={() => { dispatch(toggleWishlistItem({ product: product._id, name: product.name, price: product.price, image: product.images?.[0]?.url || '' })); toast.success(isWishlisted ? 'Removed' : 'Added to wishlist'); }}
                className={`p-3 rounded-xl border-2 transition-colors ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20' : 'hover:border-red-500 hover:text-red-500'}`}>
                <HiOutlineHeart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[{ i: HiOutlineTruck, t: 'Free Shipping' }, { i: HiOutlineShieldCheck, t: 'Warranty' }, { i: HiOutlineRefresh, t: '30-Day Return' }].map((f, idx) => (
              <div key={idx} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-navy-900">
                <f.i className="w-5 h-5 mx-auto mb-1 text-primary-500" /><p className="text-xs font-medium">{f.t}</p>
              </div>
            ))}
          </div>

          {/* Specs */}
          {product.specifications?.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="space-y-2">{product.specifications.map((s, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-dashed"><span className="text-[var(--color-text-secondary)]">{s.key}</span><span className="font-medium">{s.value}</span></div>
              ))}</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews ({reviews.length})</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? <p className="text-[var(--color-text-secondary)] py-8">No reviews yet. Be the first!</p>
            : reviews.map(r => (
              <div key={r._id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{r.user?.name?.[0]}</div>
                  <div><p className="font-semibold text-sm">{r.user?.name}</p><p className="text-xs text-[var(--color-text-secondary)]">{new Date(r.createdAt).toLocaleDateString()}</p></div>
                  <div className="ml-auto"><Rating value={r.rating} size="sm" /></div>
                </div>
                {r.title && <p className="font-medium mb-1">{r.title}</p>}
                <p className="text-sm text-[var(--color-text-secondary)]">{r.comment}</p>
              </div>
            ))}
          </div>
          {/* Review Form */}
          <div className="card p-6 h-fit">
            <h3 className="font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div><label className="text-sm font-medium block mb-2">Rating</label><Rating value={reviewForm.rating} onChange={v => setReviewForm({...reviewForm, rating: v})} interactive size="lg" /></div>
              <div><label className="text-sm font-medium block mb-2">Comment</label><textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows="4" className="input-field resize-none" required /></div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{related.map(p => <ProductCard key={p._id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
