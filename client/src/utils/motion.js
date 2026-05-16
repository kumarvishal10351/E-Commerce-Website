/** Check if user prefers reduced motion */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const motionSafe = (full, reduced = {}) =>
  prefersReducedMotion() ? reduced : full;
