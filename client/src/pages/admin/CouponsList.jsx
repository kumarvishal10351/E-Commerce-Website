/**
 * Admin coupons management page. Lists coupon codes and their details.
 *
 * This file renders the page UI and handles page-specific state, effects, and user actions.
 */

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { getCouponsAPI, createCouponAPI, deleteCouponAPI } from '../../store/api';
import toast from 'react-hot-toast';

const CouponsList = () => {
  // SECTION: State
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discountType: 'percent', discountValue: '', minPurchase: '', maxDiscount: '', expiryDate: '', usageLimit: '' });

  // SECTION: Data fetching
  const fetch = async () => {
    try { const res = await getCouponsAPI(); setCoupons(res.data.coupons); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // SECTION: Effects
  useEffect(() => { fetch(); }, []);

  // SECTION: Handlers
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCouponAPI({ ...form, discountValue: Number(form.discountValue), minPurchase: Number(form.minPurchase) || 0, maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null, usageLimit: form.usageLimit ? Number(form.usageLimit) : null });
      toast.success('Coupon created!');
      setShowForm(false); setForm({ code: '', discountType: 'percent', discountValue: '', minPurchase: '', maxDiscount: '', expiryDate: '', usageLimit: '' });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try { await deleteCouponAPI(id); toast.success('Deleted'); fetch(); }
    catch (e) { toast.error('Failed'); }
  };

  // SECTION: JSX
  return (
    <div className="space-y-6">
      {/* Header & create form toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !px-4 !py-2 flex items-center gap-2"><HiOutlinePlus className="w-4 h-4" />{showForm ? 'Cancel' : 'Add Coupon'}</button>
      </div>

      {/* Create coupon form */}
      {showForm && (
        <div className="card p-6">
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Code</label><input required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="input-field" placeholder="SAVE20" /></div>
            <div><label className="text-sm font-medium block mb-1">Type</label><select value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})} className="input-field"><option value="percent">Percentage</option><option value="fixed">Fixed Amount</option></select></div>
            <div><label className="text-sm font-medium block mb-1">Value</label><input type="number" required value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Min Purchase ($)</label><input type="number" value={form.minPurchase} onChange={e => setForm({...form, minPurchase: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Max Discount ($)</label><input type="number" value={form.maxDiscount} onChange={e => setForm({...form, maxDiscount: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Expiry Date</label><input type="date" required value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Usage Limit</label><input type="number" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} className="input-field" /></div>
            <div className="flex items-end"><button type="submit" className="btn-primary w-full">Create Coupon</button></div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-navy-900">
              <tr>{['Code', 'Type', 'Value', 'Min Purchase', 'Expiry', 'Used', 'Status', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {coupons.map(c => (
                <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-navy-900/50">
                  <td className="px-4 py-3 font-mono font-bold text-sm">{c.code}</td>
                  <td className="px-4 py-3 text-sm capitalize">{c.discountType}</td>
                  <td className="px-4 py-3 text-sm font-medium">{c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                  <td className="px-4 py-3 text-sm">${c.minPurchase}</td>
                  <td className="px-4 py-3 text-xs">{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</td>
                  <td className="px-4 py-3"><span className={`badge ${new Date(c.expiryDate) > new Date() && c.isActive ? 'badge-success' : 'badge-error'}`}>{new Date(c.expiryDate) > new Date() && c.isActive ? 'Active' : 'Expired'}</span></td>
                  <td className="px-4 py-3"><button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button></td>
                </tr>
              ))}
              {coupons.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-[var(--color-text-secondary)]">No coupons yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponsList;
