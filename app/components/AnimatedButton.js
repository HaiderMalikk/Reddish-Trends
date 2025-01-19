"use client";

import { motion } from "framer-motion";

export default function AnimatedButton({ children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="px-6 py-2 bg-customBlue text-white rounded-lg font-semibold shadow-lg mb-4"
    >
      {children}
    </motion.button>

  );
}
