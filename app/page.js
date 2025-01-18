"use client";  // This ensures it's only rendered on the client side

import Image from "next/image";  
import { motion, useInView } from "framer-motion";  
import { useRef } from "react";  
import png from "../public/logo.png";  
import AnimatedButton from "./components/AnimatedButton";


export default function HomePage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  
  const isInView1 = useInView(ref1, { once: true });
  const isInView2 = useInView(ref2, { once: true });
  const isInView3 = useInView(ref3, { once: true });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      
      {/* Logo Section */}
      <motion.div
        ref={ref1}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <Image
          src={png}  
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-signature text-blue-600 mb-2">My Web App</h1>
        <p className="text-lg text-gray-700">A description of the app goes here. This is where you can explain what your app does and what users can expect.</p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={ref2}
        initial={{ opacity: 0, x: -100 }}
        animate={isInView2 ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-20 p-6 bg-white shadow-lg rounded-lg w-3/4 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Amazing Features</h2>
        <p className="text-gray-600">Explore powerful features that make this app stand out.</p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        ref={ref3}
        initial={{ opacity: 0, y: 100 }}
        animate={isInView3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="mt-20 p-6 bg-blue-500 text-white shadow-lg rounded-lg w-3/4 text-center"
      >
        <AnimatedButton>
        <h2 className="make-acc-btn">Click Me!</h2>
      </AnimatedButton>
        <p>Join us and experience the power of our platform.</p>
      </motion.div>
      
    </div>
  );
}
