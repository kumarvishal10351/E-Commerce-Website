import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Button from '../ui/Button';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Full-screen hero with parallax, staggered headline, floating products
 */
const Hero = () => {
  const orbitRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !orbitRef.current) return;
    const items = orbitRef.current.querySelectorAll('.orbit-item');
    gsap.to(items, { rotation: 360, duration: 40, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
  }, []);

  const headline = 'Curated Luxury';
  const letters = headline.split('');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden noise-overlay dot-grid">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop" alt="" className="w-full h-full object-cover opacity-30" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg/40 via-luxury-bg/80 to-luxury-bg" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-luxury-purple/30 rounded-full blur-[120px] animate-pulse-glow" />
        <motion.div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-luxury-gold/20 rounded-full blur-[120px] animate-pulse-glow" />
      </div>

      <div ref={orbitRef} className="absolute inset-0 pointer-events-none hidden lg:block">
        {['sneakers', 'watch', 'perfume'].map((kw, i) => (
          <img key={kw} src={`https://images.unsplash.com/photo-${i === 0 ? '1542291026-7eec264c27ff' : i === 1 ? '1523275335684-37898b6baf30' : '1541643600914-78b084683601'}?w=200&h=200&fit=crop`} alt="" className={`orbit-item absolute w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-glow animate-float ${i === 0 ? 'top-[20%] right-[15%]' : i === 1 ? 'top-[50%] right-[8%]' : 'top-[35%] right-[25%]'}`} style={{ animationDelay: `${i * 0.5}s` }} loading="lazy" />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 w-full">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="font-accent text-luxury-gold tracking-[0.3em] uppercase text-sm mb-6">
          Spring Collection 2025
        </motion.p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6">
          {letters.map((char, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.5 }} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg text-luxury-muted max-w-lg mb-10 leading-relaxed">
          Discover 25 handpicked essentials — from Nike to Chanel. Premium quality, delivered to your door.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-4">
          <Link to="/products"><Button magnetic>Shop Collection</Button></Link>
          <Link to="/products?isFeatured=true"><Button variant="ghost">Featured Drops</Button></Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
