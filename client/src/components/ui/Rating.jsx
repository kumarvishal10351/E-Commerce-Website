// SECTION: Imports — staggered star fill on mount; respects reduced motion
import { useEffect, useState } from 'react';
import { HiStar } from 'react-icons/hi';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Star rating with staggered fill on mount
 */
const Rating = ({ value = 0, count, size = 'sm', stagger = true }) => {
  // SECTION: Stagger state — starts at 0 stars filled, animates to 5 for reveal effect
  const [filled, setFilled] = useState(prefersReducedMotion() ? 5 : 0);
  // SECTION: Size map — icon dimensions per size prop
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  // SECTION: Mount effect — triggers fill animation after brief delay (skipped if reduced motion)
  useEffect(() => {
    if (prefersReducedMotion() || !stagger) {
      setFilled(5);
      return;
    }
    const t = setTimeout(() => setFilled(5), 100);
    return () => clearTimeout(t);
  }, [stagger]);

  // SECTION: Render — five stars colored by rounded value; optional review count
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <HiStar
          key={i}
          className={`${sizes[size]} transition-colors duration-300 ${i < Math.round(value) && i < filled ? 'text-luxury-gold' : 'text-white/15'}`}
          style={stagger && !prefersReducedMotion() ? { transitionDelay: `${i * 80}ms` } : undefined}
        />
      ))}
      {count != null && <span className="text-xs text-luxury-muted ml-1.5">({count})</span>}
    </div>
  );
};

export default Rating;
