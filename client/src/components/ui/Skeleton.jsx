// SECTION: Product card skeleton — placeholder while product grid data loads
export const ProductCardSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="aspect-square skeleton-luxury" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 skeleton-luxury rounded" />
      <div className="h-4 w-full skeleton-luxury rounded" />
      <div className="h-4 w-2/3 skeleton-luxury rounded" />
      <div className="h-5 w-24 skeleton-luxury rounded" />
    </div>
  </div>
);

// SECTION: Page skeleton — title bar + grid of product card placeholders
export const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
    <div className="h-12 w-64 skeleton-luxury rounded-xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  </div>
);

export default ProductCardSkeleton;
