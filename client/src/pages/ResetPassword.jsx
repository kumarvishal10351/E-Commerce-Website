/**
 * Password reset form page. Lets users set a new password.
 *
 * This file renders the page UI and handles page-specific state, effects, and user actions.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { resetPasswordAPI } from '../store/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  // SECTION: Router
  const { token } = useParams();
  const navigate = useNavigate();

  // SECTION: State
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // SECTION: Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try { await resetPasswordAPI(token, { password }); toast.success('Password reset!'); navigate('/login'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  // SECTION: JSX
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-2xl font-bold">Reset Password</h1></div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="text-sm font-medium block mb-1.5">New Password</label><div className="relative"><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field pl-11" /><HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div></div>
            <div><label className="text-sm font-medium block mb-1.5">Confirm Password</label><div className="relative"><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="input-field pl-11" /><HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
