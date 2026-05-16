import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import { getAllCategoriesAPI, createCategoryAPI, updateCategoryAPI, deleteCategoryAPI } from '../../store/api';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetch = async () => {
    try { const res = await getAllCategoriesAPI(); setCategories(res.data.categories); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateCategoryAPI(editId, form); toast.success('Updated!'); }
      else { await createCategoryAPI(form); toast.success('Created!'); }
      setShowForm(false); setEditId(null); setForm({ name: '', description: '' });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (cat) => { setForm({ name: cat.name, description: cat.description || '' }); setEditId(cat._id); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategoryAPI(id); toast.success('Deleted'); fetch(); }
    catch (e) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', description: '' }); }} className="btn-primary text-sm !px-4 !py-2 flex items-center gap-2">
          {showForm ? <><HiOutlineX className="w-4 h-4" /> Cancel</> : <><HiOutlinePlus className="w-4 h-4" /> Add Category</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]"><label className="text-sm font-medium block mb-1">Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
            <div className="flex-1 min-w-[200px]"><label className="text-sm font-medium block mb-1">Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" /></div>
            <button type="submit" className="btn-primary !py-3">{editId ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat._id} className="card p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{cat.name}</h3>
              {cat.description && <p className="text-xs text-[var(--color-text-secondary)] mt-1">{cat.description}</p>}
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Slug: {cat.slug}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(cat)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-500"><HiOutlinePencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && !loading && <p className="text-[var(--color-text-secondary)] col-span-full text-center py-8">No categories yet</p>}
      </div>
    </div>
  );
};

export default Categories;
