/**
 * Neon-glow pill badge
 * @param {{ children: React.ReactNode, variant?: 'discount'|'stock'|'warning'|'default', className?: string }} props
 */
const Badge = ({ children, variant = 'default', className = '' }) => {
  // SECTION: Variant map — each key maps to a preset badge style (sale, stock, warning, default)
  const styles = {
    discount: 'badge-discount',
    stock: 'badge-stock',
    warning: 'badge-pill bg-amber-500/15 text-amber-400 border border-amber-500/25',
    default: 'badge-pill bg-luxury-purple/20 text-luxury-glow border border-luxury-purple/30',
  };
  // SECTION: Render — pill span with merged variant + custom classes
  return <span className={`${styles[variant] || styles.default} ${className}`}>{children}</span>;
};

export default Badge;
