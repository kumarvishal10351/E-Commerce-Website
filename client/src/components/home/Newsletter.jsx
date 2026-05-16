// SECTION: Imports — email capture with toast feedback
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';

/** Newsletter with animated gradient background */
const Newsletter = () => {
  // SECTION: Local state — controlled email input
  const [email, setEmail] = useState('');

  // SECTION: Submit handler — validates, shows success toast, clears field
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Welcome to LUXE insider list!');
    setEmail('');
  };

  // SECTION: Render — gradient card with headline and subscribe form
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card p-10 md:p-16 text-center relative overflow-hidden animate-gradient-shift bg-gradient-to-br from-luxury-purple/20 to-luxury-gold/10">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Join the Inner Circle</h2>
        <p className="text-luxury-muted mb-8 max-w-md mx-auto">Early access to drops, exclusive offers, and style guides.</p>
        {/* SECTION: Form — email + subscribe button */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" required />
          <Button type="submit">Subscribe</Button>
        </form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
