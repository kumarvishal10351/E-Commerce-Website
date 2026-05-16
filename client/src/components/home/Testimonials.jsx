// SECTION: Imports — Swiper carousel for customer review cards
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import Rating from '../ui/Rating';

// SECTION: Static review data — name, quote, star rating per slide
const REVIEWS = [
  { name: 'Priya S.', text: 'The Nike Air Max arrived in 2 days. Packaging felt like unboxing a luxury gift.', rating: 5 },
  { name: 'Arjun M.', text: 'Best e-commerce experience I have had in India. The dark UI is chef\'s kiss.', rating: 5 },
  { name: 'Sneha K.', text: 'Chanel Bleu was authentic and beautifully presented. Will shop again.', rating: 4.8 },
];

/** Auto-rotating testimonials carousel */
// SECTION: Testimonials carousel — autoplay, pagination, responsive slide count
const Testimonials = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
    {/* SECTION: Section header */}
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
      <h2 className="section-heading">Loved by Thousands</h2>
      <p className="section-sub mx-auto">Real reviews from our community</p>
    </motion.div>
    {/* SECTION: Swiper slides — one glass card per review */}
    <Swiper modules={[Autoplay, Pagination]} spaceBetween={24} slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} className="!pb-12">
      {REVIEWS.map((r) => (
        <SwiperSlide key={r.name}>
          <article className="glass-card p-8 h-full">
            <Rating value={r.rating} stagger={false} />
            <p className="text-luxury-muted mt-4 mb-6 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
            <p className="font-accent font-semibold text-luxury-gold">{r.name}</p>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default Testimonials;
