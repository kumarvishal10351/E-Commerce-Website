import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePhotograph, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { getProductAPI, createProductAPI, updateProductAPI, getCategoriesAPI, uploadImagesAPI } from '../../store/api';
import toast from 'react-hot-toast';

const ProductForm = () => {
  // SECTION: Router
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // SECTION: State
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', brand: '', stock: '', category: '', isFeatured: false, tags: '', images: [] });
  const [uploading, setUploading] = useState(false);

  // SECTION: Effects
  useEffect(() => {
    const fetch = async () => {
      const catRes = await getCategoriesAPI();
      setCategories(catRes.data.categories);
      if (isEdit) {
        const pRes = await getProductAPI(id);
        const p = pRes.data.product;
        setForm({ name: p.name, description: p.description, price: p.price, comparePrice: p.comparePrice || '', brand: p.brand, stock: p.stock, category: p.category?._id || p.category, isFeatured: p.isFeatured, tags: p.tags?.join(', ') || '', images: p.images || [] });
      }
    };
    fetch();
  }, [id, isEdit]);

  // SECTION: Handlers
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('images', f));
      const res = await uploadImagesAPI(formData);
      setForm(prev => ({ ...prev, images: [...prev.images, ...res.data.images] }));
      toast.success('Images uploaded!');
    } catch (err) { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const removeImage = (idx) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form, price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : 0, stock: Number(form.stock), tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    try {
      if (isEdit) { await updateProductAPI(id, data); toast.success('Product updated!'); }
      else { await createProductAPI(data); toast.success('Product created!'); }
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  // SECTION: JSX
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h3 className="font-bold">Basic Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="text-sm font-medium block mb-1">Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
            <div className="md:col-span-2"><label className="text-sm font-medium block mb-1">Description</label><textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="4" className="input-field resize-none" /></div>
            <div><label className="text-sm font-medium block mb-1">Price ($)</label><input type="number" step="0.01" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Compare Price ($)</label><input type="number" step="0.01" value={form.comparePrice} onChange={e => setForm({...form, comparePrice: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Brand</label><input required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Stock</label><input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-field" /></div>
            <div><label className="text-sm font-medium block mb-1">Category</label>
              <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Tags (comma separated)</label><input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="input-field" placeholder="tag1, tag2" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="rounded" /><label htmlFor="featured" className="text-sm font-medium">Featured Product</label></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold">Images</h3>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineX className="w-3 h-3" /></button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
              {uploading ? <span className="text-xs">...</span> : <><HiOutlinePhotograph className="w-6 h-6 text-gray-400" /><span className="text-xs text-gray-400 mt-1">Upload</span></>}
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">Upload product images (max 5MB each). First image is the thumbnail.</p>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
