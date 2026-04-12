import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PageTransition
 *
 * Wraps the entire route tree with AnimatePresence so every route
 * change triggers a smooth fade + slight upward slide animation.
 *
 * Rules:
 *  - mount:  opacity 0, y 20  →  opacity 1, y 0  (easeOut, 0.4s)
 *  - unmount: opacity 1, y 0  →  opacity 0, y -20 (easeIn, 0.25s)
 *
 * Usage: wrap <AppRoutes /> with this component in App.jsx.
 * No individual page or route needs to be modified.
 */

const PAGE_VARIANTS = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // custom ease-out curve (smooth, premium feel)
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        // Ensure the wrapper never clips overflowing content
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
