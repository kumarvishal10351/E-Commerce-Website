import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { login, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  // SECTION: Redux & router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const { isAuthenticated, loading, error } = useSelector(s => s.auth);

  // SECTION: State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // SECTION: Effects
  useEffect(() => {
    if (isAuthenticated) navigate(redirect ? `/${redirect}` : '/');
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  // SECTION: Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Sign in to your account</p>
        </div>

        {/* Login form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1.5">Email</label>
              <div className="relative">
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@luxe.shop" className="input-field pl-11" />
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="input-field pl-11 pr-11" />
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300" /> Remember me</label>
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">Don't have an account? <Link to="/register" className="text-primary-500 font-medium hover:underline">Sign up</Link></p>
          </div>
        </div>

        <p className="text-xs text-center text-[var(--color-text-secondary)] mt-6">
          Demo · Admin: <span className="font-mono text-luxury-muted">admin@luxe.shop</span> / admin123 · User: <span className="font-mono text-luxury-muted">john@luxe.shop</span> / password123
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
