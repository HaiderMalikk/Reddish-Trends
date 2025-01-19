"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="px-6 py-2 bg-customBlue text-white rounded-lg font-semibold shadow-lg mb-4"
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
