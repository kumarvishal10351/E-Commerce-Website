import { motion, AnimatePresence } from 'framer-motion';

/**
 * Full-screen overlay modal
 */
const Modal = ({ open, onClose, children, title }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[min(92vw,520px)] glass-card p-6 md:p-8"
        >
          {title && <h3 className="font-serif text-2xl mb-4">{title}</h3>}
          {children}
        </div>
      </>
    )}
  </AnimatePresence>
);

export default Modal;
