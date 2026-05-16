import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail } from 'react-icons/hi';
import { forgotPasswordAPI } from '../store/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordAPI({ email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send email'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">We'll send you a reset link</p>
        </div>
        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineMail className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-bold mb-2">Check your email</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">We sent a password reset link to <strong>{email}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fp-email" className="text-sm font-medium block mb-1.5">Email Address</label>
                <div className="relative">
                  <input id="fp-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="input-field pl-11" />
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary-500 hover:underline">← Back to login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
