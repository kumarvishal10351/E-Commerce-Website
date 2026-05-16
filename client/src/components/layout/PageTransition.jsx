// SECTION: Imports — fade/slide wrapper keyed by route pathname
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Route change fade + slide up
 */
const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  // SECTION: Reduced motion — plain div, no animation
  if (prefersReducedMotion()) return <div key={pathname}>{children}</div>;

  // SECTION: Animated transition — re-mounts on pathname change
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
