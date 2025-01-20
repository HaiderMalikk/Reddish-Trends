/* 
Component for the animated button (in ts)
*/

"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
}

// sinple animated button using framer motion and Tailwind CSS (on hover expand, on click shrink)
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
