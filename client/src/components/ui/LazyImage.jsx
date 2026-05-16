import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Lazy-loaded image with blur placeholder
 */
const LazyImage = ({ src, alt, className = '', hoverSrc, isHovered }) => {
  const [loaded, setLoaded] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '100px' });

  return (
    <motion.div ref={ref} className={`relative overflow-hidden ${className}`}>
      {!loaded && <motion.div className="absolute inset-0 skeleton-luxury" />}
      {inView && (
        <>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`img-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && hoverSrc ? 'opacity-0' : 'opacity-100'}`}
          />
          {hoverSrc && (
            <img
              src={hoverSrc}
              alt=""
              loading="lazy"
              className={`img-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden
            />
          )}
        </>
      )}
    </div>
  );
};

export default LazyImage;
