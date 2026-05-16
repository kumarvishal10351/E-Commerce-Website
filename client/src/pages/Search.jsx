import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { getProductsAPI } from '../store/api';
import useDebounce from '../hooks/useDebounce';
import { PRODUCTS } from '../data/products';

/** Live search results page */
const Search = () => {
  // SECTION: URL params & state
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const debounced = useDebounce(query, 300);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // SECTION: Effects
  useEffect(() => setQuery(q), [q]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (debounced.trim()) {
          const res = await getProductsAPI({ keyword: debounced, limit: 24 });
          setProducts(res.data.products || []);
        } else setProducts([]);
      } catch {
        const local = PRODUCTS.filter((p) =>
          [p.name, p.brand, p.category, ...(p.tags || [])].join(' ').toLowerCase().includes(debounced.toLowerCase())
        );
        setProducts(local.map((p) => ({ ...p, _id: p.id })));
      } finally {
        setLoading(false);
      }
    })();
  }, [debounced]);

  // SECTION: JSX
  return (
    <motion.div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="font-serif text-3xl font-bold mb-6">Search</h1>
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands..." className="input-luxury max-w-xl mb-10" autoFocus />
      {loading ? (
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}</motion.div>
      ) : products.length === 0 ? (
        <p className="text-luxury-muted">No results for &ldquo;{debounced}&rdquo;</p>
      ) : (
        <>
          <p className="text-luxury-muted mb-6">{products.length} results</p>
          <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => <ProductCard key={p._id || p.id} product={p} index={i} />)}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Search;
