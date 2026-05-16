import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

/** Animated countdown sale banner */
const SaleBanner = () => {
  const end = new Date('2025-06-01T00:00:00');
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: time.d },
    { label: 'Hours', value: time.h },
    { label: 'Mins', value: time.m },
    { label: 'Secs', value: time.s },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl p-10 md:p-16 animate-gradient-shift bg-gradient-to-r from-luxury-purple/40 via-luxury-bg to-luxury-gold/20 border border-white/10">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-accent text-luxury-gold uppercase tracking-widest text-sm mb-3">Limited Time</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Summer Luxe Sale</h2>
            <p className="text-luxury-muted mb-6">Up to 40% off on footwear & fragrances. Ends soon.</p>
            <Link to="/products"><Button magnetic>Shop the Sale</Button></Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {units.map((u) => (
              <div key={u.label} className="glass-card p-4 text-center">
                <span className="font-accent text-3xl md:text-4xl font-bold text-luxury-gold">{String(u.value).padStart(2, '0')}</span>
                <p className="text-xs text-luxury-muted mt-1 uppercase tracking-wider">{u.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SaleBanner;
