/**
 * Admin products list page. Shows product cards and management actions.
 *
 * This file renders the page UI and handles page-specific state, effects, and user actions.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import Skeleton from '../../components/ui/Skeleton';
import { getProductsAPI, deleteProductAPI } from '../../store/api';
import toast from 'react-hot-toast';

const ProductsList = () => {
  // SECTION: State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // SECTION: Data fetching
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.keyword = search;
      const res = await getProductsAPI(params);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // SECTION: Effects
  useEffect(() => { fetchProducts(); }, [page, search]);

  // SECTION: Handlers
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProductAPI(id); toast.success('Product deleted'); fetchProducts(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  // SECTION: JSX
  return (
    <div className="space-y-6">
      {/* Header & search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm !px-4 !py-2 flex items-center gap-2"><HiOutlinePlus className="w-4 h-4" /> Add Product</Link>
      </div>

      <div className="relative max-w-sm">
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="input-field pl-10 !py-2" />
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-navy-900">
              <tr>{['Image', 'Name', 'Price', 'Stock', 'Rating', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? Array.from({length:5}).map((_,i) => (
                <tr key={i}><td colSpan={6} className="p-4"><Skeleton className="h-12 w-full" /></td></tr>
              )) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-[var(--color-text-secondary)]">No products found</td></tr>
              ) : products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-navy-900/50 transition-colors">
                  <td className="px-4 py-3"><img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" /></td>
                  <td className="px-4 py-3"><p className="font-medium text-sm max-w-[200px] truncate">{p.name}</p><p className="text-xs text-[var(--color-text-secondary)]">{p.brand}</p></td>
                  <td className="px-4 py-3 font-bold text-sm">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-error'}`}>{p.stock}</span></td>
                  <td className="px-4 py-3 text-sm">⭐ {p.ratingsAverage?.toFixed(1) || '0'} ({p.ratingsCount || 0})</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/edit/${p._id}`} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-500"><HiOutlinePencil className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">{Array.from({length:totalPages},(_,i)=>i+1).map(p => (
          <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl text-sm font-medium ${page === p ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-navy-900'}`}>{p}</button>
        ))}</div>
      )}
    </div>
  );
};

export default ProductsList;
