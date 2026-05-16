/** Infinite brand logo marquee */
const BRANDS = ['Nike', 'Adidas', 'Chanel', 'Dior', 'Sony', 'Ray-Ban', 'Fossil', 'Logitech', "L'Oréal", 'Lakme'];

const BrandMarquee = () => (
  <section className="py-12 border-y border-white/5 overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...BRANDS, ...BRANDS].map((b, i) => (
        <span key={i} className="mx-12 text-2xl md:text-3xl font-serif text-white/20 hover:text-luxury-gold/60 transition-colors">
          {b}
        </span>
      ))}
    </div>
  </section>
);

export default BrandMarquee;
