import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineLocationMarker } from 'react-icons/hi';
import { updateProfile } from '../store/slices/authSlice';
import { updatePasswordAPI, updateAddressAPI, deleteAddressAPI } from '../store/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'US', isDefault: false });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email }));
    toast.success('Profile updated!');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    try { await updatePasswordAPI({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }); toast.success('Password updated!'); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try { await updateAddressAPI(addressForm); toast.success('Address saved!'); setShowAddressForm(false); window.location.reload(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteAddress = async (id) => {
    try { await deleteAddressAPI(id); toast.success('Address removed'); window.location.reload(); }
    catch (err) { toast.error('Failed'); }
  };

  const tabs = [{ id: 'profile', label: 'Profile', icon: HiOutlineUser }, { id: 'password', label: 'Password', icon: HiOutlineLockClosed }, { id: 'addresses', label: 'Addresses', icon: HiOutlineLocationMarker }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Account</h1>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="card p-4 space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'hover:bg-gray-50 dark:hover:bg-navy-900'}`}>
                <t.icon className="w-5 h-5" /> {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          {tab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div><label className="text-sm font-medium block mb-1.5">Name</label><input value={name} onChange={e => setName(e.target.value)} className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1.5">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1.5">Role</label><input value={user?.role} disabled className="input-field opacity-60" /></div>
                <button type="submit" className="btn-primary">Save Changes</button>
              </form>
            </motion.div>
          )}
          {tab === 'password' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
              <h2 className="text-xl font-bold mb-6">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                <div><label className="text-sm font-medium block mb-1.5">Current Password</label><input type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} required className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1.5">New Password</label><input type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} required className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1.5">Confirm New Password</label><input type="password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} required className="input-field" /></div>
                <button type="submit" className="btn-primary">Update Password</button>
              </form>
            </motion.div>
          )}
          {tab === 'addresses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Saved Addresses</h2><button onClick={() => setShowAddressForm(!showAddressForm)} className="btn-primary text-sm !px-4 !py-2">{showAddressForm ? 'Cancel' : '+ Add Address'}</button></div>
              {showAddressForm && (
                <div className="card p-6">
                  <form onSubmit={handleAddAddress} className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium block mb-1">Name</label><input required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} className="input-field" /></div>
                    <div><label className="text-sm font-medium block mb-1">Phone</label><input required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="input-field" /></div>
                    <div className="col-span-2"><label className="text-sm font-medium block mb-1">Address</label><input required value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} className="input-field" /></div>
                    <div><label className="text-sm font-medium block mb-1">City</label><input required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="input-field" /></div>
                    <div><label className="text-sm font-medium block mb-1">State</label><input required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="input-field" /></div>
                    <div><label className="text-sm font-medium block mb-1">Postal Code</label><input required value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} className="input-field" /></div>
                    <div><label className="text-sm font-medium block mb-1">Country</label><input required value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} className="input-field" /></div>
                    <div className="col-span-2"><button type="submit" className="btn-primary">Save Address</button></div>
                  </form>
                </div>
              )}
              {user?.addresses?.length > 0 ? user.addresses.map(addr => (
                <div key={addr._id} className="card p-5 flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{addr.fullName} {addr.isDefault && <span className="badge badge-success ml-2">Default</span>}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{addr.phone}</p>
                  </div>
                  <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              )) : !showAddressForm && <p className="text-[var(--color-text-secondary)] text-center py-8">No saved addresses</p>}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
