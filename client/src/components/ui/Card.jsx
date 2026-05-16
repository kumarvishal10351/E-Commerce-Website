// SECTION: Imports — Framer Motion hover; prefersReducedMotion for accessibility
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Glassmorphism card with hover lift
 */
// SECTION: Card wrapper — glass-card styling; optional lift + shadow on hover
const Card = ({ children, className = '', hover = true, ...props }) => (
  <motion.div
    whileHover={hover && !prefersReducedMotion() ? { y: -8, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' } : {}}
    transition={{ duration: 0.3 }}
    className={`glass-card overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
