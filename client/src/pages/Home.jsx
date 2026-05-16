import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import Hero from '../components/home/Hero';
import SaleBanner from '../components/home/SaleBanner';
import BrandMarquee from '../components/home/BrandMarquee';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { getFeaturedProductsAPI, getCategoriesAPI } from '../store/api';
import { CATEGORIES } from '../data/products';
import { HiOutlineArrowRight, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';

/** Premium homepage */
const Home = () => {
  // SECTION: State
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // SECTION: Effects
  useEffect(() => {
    (async () => {
      try {
        const res = await getFeaturedProductsAPI(8);
        setFeatured(res.data.products || []);
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // SECTION: JSX
  return (
    <motion.div className="pb-20 md:pb-0">
      <Hero />
      {/* Trust badges */}
      <section className="border-y border-white/5 py-8">
        <motion.div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: HiOutlineTruck, t: 'Free Shipping', d: 'Orders over ₹999' },
            { icon: HiOutlineRefresh, t: 'Easy Returns', d: '30-day policy' },
            { icon: HiOutlineShieldCheck, t: 'Secure Pay', d: '100% protected' },
            { icon: HiOutlineShieldCheck, t: 'Authentic', d: 'Verified products' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-xl bg-luxury-purple/20 flex items-center justify-center"><f.icon className="w-6 h-6 text-luxury-gold" /></span>
              <motion.div><p className="font-medium text-sm">{f.t}</p><p className="text-xs text-luxury-muted">{f.d}</p></motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      {/* Categories carousel */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div className="flex justify-between items-end mb-10">
          <motion.div><h2 className="section-heading">Shop by Category</h2><p className="section-sub">Explore curated collections</p></motion.div>
        </motion.div>
        <Swiper modules={[FreeMode]} freeMode slidesPerView="auto" spaceBetween={16} className="!overflow-visible">
          {CATEGORIES.map((cat) => (
            <SwiperSlide key={cat.slug} className="!w-[200px]">
              <Link to={`/products?category=${cat.slug}`} className="glass-card block p-6 text-center hover:-translate-y-1 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-20 h-20 mx-auto rounded-2xl object-cover mb-3" loading="lazy" />
                <p className="text-2xl mb-1">{cat.emoji}</p>
                <h3 className="font-medium text-sm">{cat.name}</h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div className="flex justify-between items-end mb-10">
          <motion.div><h2 className="section-heading">Featured</h2><p className="section-sub">Handpicked for you</p></motion.div>
          <Link to="/products?isFeatured=true" className="btn-ghost !py-2 !px-4 text-sm hidden sm:flex items-center gap-1">View All <HiOutlineArrowRight /></Link>
        </motion.div>
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />) : featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </motion.div>
      </section>
      {/* Marketing blocks */}
      <SaleBanner />
      <BrandMarquee />
      <Testimonials />
      <Newsletter />
    </motion.div>
  );
};

export default Home;
