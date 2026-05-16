/**
 * Infinite brand logo marquee
 *
 * This component renders a horizontally scrolling strip of brand names.
 * It duplicates the brand list in the DOM to create a seamless looping effect
 * when combined with the CSS `animate-marquee` animation.
 */

// SECTION: Brand list — these are the names shown in the marquee.
// The array is repeated in the rendered output to ensure there is no visible gap
// while the CSS animation scrolls continuously from right to left.
const BRANDS = [
  "Nike",
  "Adidas",
  "Chanel",
  "Dior",
  "Sony",
  "Ray-Ban",
  "Fossil",
  "Logitech",
  "L'Oréal",
  "Lakme",
];

// SECTION: Marquee strip — wrapper + animated content.
// The outer section adds vertical padding, a top/bottom border, and hides overflow
// so the scrolling text stays within the visible marquee area.
const BrandMarquee = () => (
  <section className="py-12 border-y border-white/5 overflow-hidden">
    {/*
      The inner container uses flexbox and whitespace-nowrap to keep all brand
      names on a single horizontal line. `animate-marquee` applies the scrolling
      keyframes defined in CSS.
    */}
    <div className="flex animate-marquee whitespace-nowrap">
      {
        // Duplicate the brand array so the animation can loop smoothly without
        // a blank interval between repeats.
        [...BRANDS, ...BRANDS].map((b, i) => (
          <span
            key={i}
            className="mx-12 text-2xl md:text-3xl font-serif text-white/20 hover:text-luxury-gold/60 transition-colors"
          >
            {b}
          </span>
        ))
      }
    </div>
  </section>
);

export default BrandMarquee;
