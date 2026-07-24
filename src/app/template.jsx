'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

/**
 * `template.jsx` re-mounts on every navigation (unlike `layout.jsx`), which
 * makes it the right place for a lightweight route-change transition.
 */
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
