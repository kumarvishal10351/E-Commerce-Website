// SECTION: Imports — motion for tap animation; prefersReducedMotion respects accessibility
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Premium gradient button with optional magnetic hover
 * @param {{ children: React.ReactNode, variant?: 'primary'|'ghost'|'outline', className?: string, magnetic?: boolean, loading?: boolean, onClick?: () => void, type?: string, disabled?: boolean }} props
 */
const Button = ({ children, variant = 'primary', className = '', magnetic = false, loading, onClick, type = 'button', disabled, ...rest }) => {
  // SECTION: Variant styles — maps variant prop to CSS utility classes
  const base = variant === 'primary' ? 'btn-gradient' : variant === 'ghost' ? 'btn-ghost' : 'btn-ghost border-luxury-purple/40';

  // SECTION: Magnetic hover — shifts button toward cursor; skipped when reduced motion is preferred
  const handleMouseMove = (e) => {
    if (!magnetic || prefersReducedMotion()) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  // SECTION: Render — motion.button with loading spinner or children
  return (
    <motion.button
      type={type}
      whileTap={prefersReducedMotion() ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${base} inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};

export default Button;
