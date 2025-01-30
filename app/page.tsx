"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useLayoutEffect, useState } from "react";
import logotext from "../public/logo-w-text.svg";
import AnimatedButton from "./components/AnimatedButton";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const text = "Trade With Confidence, Trade With Sense.";
  const [displayedText, setDisplayedText] = useState<string>("");

  // Refs for GSAP animations
  const logoRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const underlineRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (!logoRef.current || !textRef.current) return;

    // Reset displayed text
    setDisplayedText("");

    // Animate logo entrance
    gsap.fromTo(logoRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1 });

    // Animate text fade-in
    gsap.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5 });

    // Typing effect
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length-1) clearInterval(typingInterval);
    }, 50);

    // Scroll-triggered animations
    sectionRefs.current.forEach((section, index) => {
      if (section) {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    // Underline animations
    underlineRefs.current.forEach((underline, index) => {
      if (underline) {
        gsap.fromTo(
          underline,
          { width: "0%" },
          {
            width: "100%",
            duration: 1,
            delay: index * 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: underline,
              start: "top 80%",
              end: "bottom 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="min-h-screen bg-customColor1 flex flex-col items-center justify-center pt-20">
      {/* Logo Section */}
      <div className="text-center mb-2 mt-2">
        <Image
          ref={logoRef}
          src={logotext}
          alt="Logo"
          width={500}
          height={500}
          className="mx-auto mb-4 mt-4"
          style={{ opacity: 0 }} // Set initial opacity to 0
        />
        <p ref={textRef} className="text-lg text-customColor2 font-secondary" style={{ opacity: 0 }}>
          {displayedText}
        </p>
      </div>

      {/* What is TradeSense? */}
      <div
        ref={(el) => {
          if (el) sectionRefs.current[0] = el;
        }}
        className="mt-20 p-6 bg-customColor3 shadow-2xl rounded-lg w-3/4 text-center"
        style={{ opacity: 0 }} // Set initial opacity to 0
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 relative">
          What is TradeSense?
          <div
            ref={(el) => {
              if (el) underlineRefs.current[0] = el;
            }}
            className="absolute bottom-0 left-0 h-1 bg-gray-800"
            style={{ width: "0%" }}
          ></div>
        </h2>
        <ul className="custom-list text-left mt-4 text-customColor2">
          <li>🔥 <strong>How It Works:</strong></li>
          <ul className="pl-4 list-disc">
            <li>- Combines social sentiment and financial trends for trading insights.</li>
            <li>- Analyzes social media sentiment and market trends simultaneously.</li>
          </ul>
          <li>✅ <strong>Features:</strong></li>
          <ul className="pl-4 list-disc">
            <li>* Social sentiment trends (Twitter, Reddit, Google Trends)</li>
            <li>* Stock market technical indicators</li>
            <li>* Fundamental analysis & macroeconomic factors</li>
          </ul>
        </ul>
      </div>

      {/* Pricing Plans */}
      <div
        ref={(el) => {
          if (el) sectionRefs.current[1] = el;
        }}
        className="mt-20 p-6 bg-customColor3 shadow-2xl rounded-lg w-3/4 text-center"
        style={{ opacity: 0 }} // Set initial opacity to 0
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 relative">
          Pricing Plans
          <div
            ref={(el) => {
              if (el) underlineRefs.current[1] = el;
            }}
            className="absolute bottom-0 left-0 h-1 bg-gray-800"
            style={{ width: "0%" }}
          ></div>
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black">Free Plan</h3>
            <p className="text-gray-600">$0.0/month - Access to basic trading insights.</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-600">Pro Plan (Coming Soon)</h3>
            <p className="text-gray-600">$2.99/month - Includes advanced tools & analysis.</p>
          </div>
        </div>
      </div>

      {/* Sign Up Section */}
      <div
        ref={(el) => {
          if (el) sectionRefs.current[2] = el;
        }}
        className="mt-20 p-6 bg-customColor3 text-center shadow-2xl rounded-lg w-3/4 mb-10 flex justify-center items-center flex-col"
        style={{ opacity: 0 }} // Set initial opacity to 0
      >
        <Link href="/login">
          <AnimatedButton>
            <h2 className="text-3xl font-semibold text-customColor2">Get Started for Free</h2>
          </AnimatedButton>
        </Link>
        <p className="text-customColor2">Sign up now and take your trading to the next level.</p>
      </div>
    </div>
  );
}   