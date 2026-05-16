// SECTION: Imports — custom ring cursor on desktop; disabled for reduced motion
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Custom animated cursor — desktop only
 */
const CustomCursor = () => {
  // SECTION: State — cursor position and enlarged ring over interactive elements
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  // SECTION: Event listeners — track mouse; grow ring on links/buttons/inputs
  useEffect(() => {
    if (prefersReducedMotion() || window.innerWidth < 768) return;
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, select, textarea')) setHovering(true);
    };
    const onOut = () => setHovering(false);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  // SECTION: Early exit — no custom cursor on mobile or when user prefers reduced motion
  if (prefersReducedMotion() || typeof window !== 'undefined' && window.innerWidth < 768) return null;

  // SECTION: Render — spring-follow ring with blend mode for contrast
  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
      animate={{ x: pos.x - (hovering ? 24 : 12), y: pos.y - (hovering ? 24 : 12) }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <motion.div
        animate={{ width: hovering ? 48 : 24, height: hovering ? 48 : 24 }}
        className="rounded-full border-2 border-white bg-white/10"
      />
    </motion.div>
  );
};

export default CustomCursor;
