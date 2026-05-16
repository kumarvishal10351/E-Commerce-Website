import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import Rating from '../components/ui/Rating';
import { getProductsAPI, getCategoriesAPI, getBrandsAPI } from '../store/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('price[gte]') || '';
  const maxPrice = searchParams.get('price[lte]') || '';
  const rating = searchParams.get('ratingsAverage[gte]') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, b] = await Promise.all([getCategoriesAPI(), getBrandsAPI()]);
        setCategories(c.data.categories); setBrands(b.data.brands);
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (minPrice) params['price[gte]'] = minPrice;
        if (maxPrice) params['price[lte]'] = maxPrice;
        if (rating) params['ratingsAverage[gte]'] = rating;
        const res = await getProductsAPI(params);
        setProducts(res.data.products);
        setTotalProducts(res.data.totalProducts);
        setTotalPages(res.data.totalPages);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [keyword, category, brand, minPrice, maxPrice, rating, sort, page]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page'); setSearchParams(p);
  };
  const clearFilters = () => setSearchParams({});
  const hasFilters = keyword || category || brand || minPrice || maxPrice || rating;

  const Filters = () => (
    <div className="space-y-6">
      {hasFilters && <button onClick={clearFilters} className="text-sm text-red-500 flex items-center gap-1"><HiOutlineX className="w-4 h-4" /> Clear filters</button>}
      <div>
        <h3 className="font-semibold mb-3 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">Category</h3>
        {categories.map(c => (
          <button key={c._id} onClick={() => updateFilter('category', category === c._id ? '' : c._id)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${category === c._id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'hover:bg-gray-50 dark:hover:bg-navy-900'}`}>{c.name}</button>
        ))}
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">Price</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => updateFilter('price[gte]', e.target.value)} className="input-field !py-2 text-sm" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => updateFilter('price[lte]', e.target.value)} className="input-field !py-2 text-sm" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">Rating</h3>
        {[4,3,2,1].map(r => (
          <button key={r} onClick={() => updateFilter('ratingsAverage[gte]', rating == r ? '' : r)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm ${rating == r ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-navy-900'}`}>
            <Rating value={r} size="sm" /> <span className="text-[var(--color-text-secondary)]">& up</span>
          </button>
        ))}
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">Brand</h3>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {brands.map(b => (
            <button key={b} onClick={() => updateFilter('brand', brand === b ? '' : b)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${brand === b ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'hover:bg-gray-50 dark:hover:bg-navy-900'}`}>{b}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{keyword ? `Results for "${keyword}"` : 'All Products'}</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{totalProducts} products</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={sort} onChange={e => updateFilter('sort', e.target.value)} className="input-field !py-2 !w-auto text-sm">
            {[{v:'-createdAt',l:'Newest'},{v:'price',l:'Price: Low'},{v:'-price',l:'Price: High'},{v:'-ratingsAverage',l:'Top Rated'}].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2.5 rounded-xl border"><HiOutlineAdjustments className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0"><div className="card p-6 sticky top-24"><Filters /></div></aside>
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} aria-hidden />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="absolute right-0 top-0 bottom-0 w-80 glass-card p-6 overflow-y-auto">
              <div className="flex justify-between mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <button type="button" onClick={() => setShowFilters(false)}><HiOutlineX className="w-5 h-5" /></button>
              </div>
              <Filters />
            </motion.div>
          </div>
        )}
        <div className="flex-1">
          {loading ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">{Array.from({length:12}).map((_,i) => <ProductCardSkeleton key={i} />)}</div>
          : products.length === 0 ? <div className="text-center py-20"><p className="text-6xl mb-4">🔍</p><h3 className="text-xl font-bold mb-2">No products found</h3><button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button></div>
          : <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
            {totalPages > 1 && <div className="flex justify-center gap-2 mt-12">{Array.from({length:totalPages},(_,i)=>i+1).map(p => <button key={p} onClick={() => updateFilter('page', p)} className={`w-10 h-10 rounded-xl font-medium text-sm ${page === p ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-navy-900'}`}>{p}</button>)}</div>}
          </>}
        </div>
      </div>
    </div>
  );
};

export default Products;
