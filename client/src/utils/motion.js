/** SECTION: Motion utilities — respect prefers-reduced-motion for accessibility */

// ─── Detect OS/browser reduced-motion preference ───
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Pick full vs reduced Framer Motion props ───
export const motionSafe = (full, reduced = {}) =>
  prefersReducedMotion() ? reduced : full;
