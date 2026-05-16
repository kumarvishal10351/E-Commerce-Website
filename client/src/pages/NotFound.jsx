/**
 * 404 page. Shown when no route matches the requested URL.
 *
 * This file renders the page UI and handles page-specific state, effects, and user actions.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

/** Creative 404 page */
const NotFound = () => (
  // SECTION: JSX
  <div className="min-h-[80vh] flex items-center justify-center px-4 dot-grid">
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <motion.p animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl md:text-9xl font-serif font-bold bg-gradient-to-r from-luxury-purple to-luxury-gold bg-clip-text text-transparent mb-4">
        404
      </motion.p>
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">Lost in the void</h2>
      <p className="text-luxury-muted mb-8 max-w-md mx-auto">This page drifted beyond our collection. Let&apos;s get you back to something beautiful.</p>
      <Link to="/"><Button magnetic>Return Home</Button></Link>
    </motion.div>
  </div>
);

export default NotFound;
