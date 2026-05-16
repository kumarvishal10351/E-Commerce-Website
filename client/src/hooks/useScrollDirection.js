/** SECTION: useScrollDirection — tracks scroll up/down and whether user scrolled past threshold */

import { useState, useEffect } from 'react';

// ─── Hook: direction, scrollY, and isScrolled (e.g. hide/show header) ───
export const useScrollDirection = (threshold = 10) => {
  const [direction, setDirection] = useState('up');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < threshold) return;
      setDirection(y > lastY ? 'down' : 'up');
      setScrollY(y);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { direction, scrollY, isScrolled: scrollY > 40 };
};

export default useScrollDirection;
