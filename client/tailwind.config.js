/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: '#0A0A0F',
          surface: '#12121A',
          glass: 'rgba(255,255,255,0.04)',
          gold: '#C9A84C',
          purple: '#7C3AED',
          glow: '#A855F7',
          text: '#F8F8FF',
          muted: '#9CA3AF',
          border: 'rgba(255,255,255,0.08)',
          danger: '#EF4444',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        accent: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite linear',
        aurora: 'aurora 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        aurora: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #7C3AED 0%, #C9A84C 100%)',
        'gradient-aurora': 'linear-gradient(-45deg, #0A0A0F, #1a0a2e, #0A0A0F, #1a1a0f)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(168, 85, 247, 0.25)',
        'glow-gold': '0 0 40px rgba(201, 168, 76, 0.2)',
        card: '0 20px 60px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
