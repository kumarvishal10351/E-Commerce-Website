/** SECTION: useDebounce — delays updating a value until typing/input pauses */

import { useState, useEffect } from 'react';

// ─── Hook: returns debounced copy of `value` after `delay` ms ───
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

export default useDebounce;
