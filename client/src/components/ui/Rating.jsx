import { useEffect, useState } from 'react';
import { HiStar } from 'react-icons/hi';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Star rating with staggered fill on mount
 */
const Rating = ({ value = 0, count, size = 'sm', stagger = true }) => {
  const [filled, setFilled] = useState(prefersReducedMotion() ? 5 : 0);
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  useEffect(() => {
    if (prefersReducedMotion() || !stagger) {
      setFilled(5);
      return;
    }
    const t = setTimeout(() => setFilled(5), 100);
    return () => clearTimeout(t);
  }, [stagger]);

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
