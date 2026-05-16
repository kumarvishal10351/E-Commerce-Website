/**
 * Registration page. Lets new users sign up for an account.
 *
 * This file renders the page UI and handles page-specific state, effects, and user actions.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  // SECTION: Redux & router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(s => s.auth);

  // SECTION: State
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  // SECTION: Effects
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  // SECTION: Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  // SECTION: JSX
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-xl bg-gradient-luxury flex items-center justify-center font-serif font-bold text-xl text-white">L</span>
            <span className="text-2xl font-serif font-bold">LUXE</span>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Join LUXE today</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1.5">Full Name</label>
              <div className="relative">
                <input id="name" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="John Doe" className="input-field pl-11" />
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="reg-email" className="text-sm font-medium block mb-1.5">Email</label>
              <div className="relative">
                <input id="reg-email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="you@luxe.shop" className="input-field pl-11" />
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="reg-password" className="text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="Min 6 characters" className="input-field pl-11 pr-11" />
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-sm font-medium block mb-1.5">Confirm Password</label>
              <div className="relative">
                <input id="confirm-password" type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required placeholder="••••••••" className="input-field pl-11" />
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">Already have an account? <Link to="/login" className="text-primary-500 font-medium hover:underline">Sign in</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
