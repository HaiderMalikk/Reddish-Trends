"use client";  // This ensures it's only rendered on the client side

import Image from "next/image";  
import { motion, useInView } from "framer-motion";  
import { useRef, useState, useEffect } from "react";  
import logotext from '../public/logo-w-text.svg'; 
import AnimatedButton from "./components/AnimatedButton";
import Link from "next/link";

export default function HomePage() {
  const text = " Trade With Confidence, Trade With Sense."; // start with space 
  const [displayedText, setDisplayedText] = useState("");

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const isInView1 = useInView(ref1, { once: true });
  const isInView2 = useInView(ref2, { once: true });
  const isInView3 = useInView(ref3, { once: true });
  const isInView4 = useInView(ref4, { once: true });

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]); // Add one character at a time to the displayedText
      index++;
      if (index === text.length - 1) {
        clearInterval(typingInterval); // Stop once the whole text is typed
      }
    }, 50); // Typing speed in milliseconds

    return () => clearInterval(typingInterval); // Cleanup on unmount
  }, [text]);

  return (
    <div className="min-h-screen bg-customBlue flex flex-col items-center justify-center">
      
      {/* Logo Section */}
      <motion.div
        ref={ref1}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-2 mt-2"
      >
        <Image
          src={logotext}  
          alt="Logo"
          width={500}  
          height={500} 
          className="mx-auto mb-4 mt-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-customWhite font-secondary"
        >
          {displayedText}
        </motion.p>
      </motion.div>

      {/* What is TradeSense? Section */}
      <motion.div
        ref={ref2}
        initial={{ opacity: 0, x: -100 }}
        animate={isInView2 ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-20 p-6 bg-customWhite shadow-lg rounded-lg w-3/4 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What is TradeSense?</h2>
        <ul className="text-left mt-4 text-black">
          <li>🔥 <strong>How It Works:</strong></li>
          <ul className="pl-4">
          <li>- Instead of just using social media sentiment or just stock trends and market info, why not combine both to make a unique trading helper?</li>
          <li>- It can analyze social media posts to gauge public sentiment about a company or stock while also using traditional financial data such as stock prices, trading volumes, and economic indicators to make predictions.</li>
          </ul>
          <li>✅ <strong>Features:</strong></li>
          <ul className="pl-4">
            <li>* Social sentiment trends (Twitter, Reddit, Google Trends)</li>
            <li>* Stock market technical indicators (moving averages, RSI, volume trends)</li>
            <li>* Fundamental analysis (company earnings, financial ratios)</li>
            <li>* Macroeconomic factors (inflation rates, interest rates)</li>
            <li>* Historical correlations (patterns between sentiment & price changes)</li>
          </ul>
        </ul>
      </motion.div>

      {/* Pricing Plans Section */}
      <motion.div
        ref={ref3}
        initial={{ opacity: 0, x: 100 }}
        animate={isInView3 ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-20 p-6 bg-customWhite shadow-lg rounded-lg w-3/4 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pricing Plans</h2>
        <div className="space-y-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black">Free Plan</h3>
            <p className="text-gray-600">$0.0/month - Access to basic trading insights.</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-semibold" style={{ color: "#d4b404" }} >Pro Plan</h3>
            <p className="text-gray-600">$2.99/month - Everything in Free Plan + Access to advanced tools and analysis.</p>
          </div>
        </div>
      </motion.div>

      {/* Make a Free Account Section */}
      <motion.div
        ref={ref4}
        initial={{ opacity: 0, y: 100 }}
        animate={isInView4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-20 p-6 bg-customWhite text-center shadow-lg rounded-lg w-3/4 mb-10 flex justify-center items-center flex-col"
      >
        <Link href="/login" >
        <AnimatedButton >
          <h2 className="text-3xl font-semibold text-customWhite">Get Started for Free</h2>
        </AnimatedButton>
        </Link>
        <p className="text-black">Sign up now to start using TradeSenseAI and take your trading to the next level.</p>
      </motion.div>


    </div>
  );
}
