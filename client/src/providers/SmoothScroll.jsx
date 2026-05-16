/** SECTION: Smooth scroll provider — Lenis inertial scrolling (skipped if reduced motion) */

import { useEffect } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion } from '../utils/motion';

// ─── Component: init Lenis RAF loop, cleanup on unmount ───
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;
