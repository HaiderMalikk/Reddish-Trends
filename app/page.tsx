'use client';
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import logotext from "../public/logo-w-text.svg";
import AnimatedButton from "./components/AnimatedButton";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const text = "Trrade With Confidence, Trade With Sense.";
  const [displayedText, setDisplayedText] = useState<string>("");

  const logoRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const animatedItemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!logoRef.current || !textRef.current) return;

    setDisplayedText("");

    gsap.fromTo(logoRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1 });
    gsap.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5 });

    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      
      // When we reach the end of the text
      if (index === text.length -1 ) {
        clearInterval(typingInterval);
  
        // Start deleting "Sense" letter by letter

        let deleteIndex = 6; // "Sense" has 5 letters plus the period 
        const deleteInterval = setInterval(() => {
          setDisplayedText((prev) => prev.slice(0, -1)); // Remove last letter
          deleteIndex--;
          
          if (deleteIndex === 0) {
            clearInterval(deleteInterval);
  
            // Start typing "US"
            let usIndex = 0;
            const usLetters = "UUs."; // frist letter is ignoreed and i cant figure out why but it works so we dont touch it O_o
            const addUSInterval = setInterval(() => {
              setDisplayedText((prev) => prev + usLetters[usIndex]);
              usIndex++;
  
              if (usIndex === usLetters.length -1) {
                clearInterval(addUSInterval);
              }
            }, 250); // timing for the "US" animation
          }
        }, 150); // timing for the delete animation
      }
    }, 55); // Typing speed overall

    // Apply ScrollTrigger animation to each section
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

    // Animate the items when they come into view
    animatedItemsRef.current.forEach((item, index) => {
      if (item) {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
        const underline = item.querySelector(".underline-animation");
  
        gsap.fromTo(
          underline,
          { width: "0%" },
          {
            width: "100%",
            duration: 1,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: item,
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
      <div className="text-center mb-2 mt-2 pt-20">
        <Image ref={logoRef} src={logotext} alt="Logo" width={800} height={800} className="mx-auto mb-8 mt-4" style={{ opacity: 0 }} />
        <p ref={textRef} className="text-2xl text-customColor2 font-secondary">{displayedText}</p>
      </div>

      <div ref={(el) => { if (el) sectionRefs.current[0] = el; }} className="mt-20 p-6 text-center">
        <h2 ref={(el) => { if (el) animatedItemsRef.current[0] = el; }} className="font-bold text-customColor2 mb-2 relative inline-block" style={{ fontSize: "3rem" }}>
          What is TradeSense?
          <div className="underline-animation"></div>
        </h2>
        <div className="mt-8 space-y-8 bg-customColor4 p-8 rounded-lg ml-20 mr-20 mb-20 shadow-2xl" ref={(el) => { if (el) animatedItemsRef.current[4] = el; }}>
          <p className=" text-customColor6" style={{ fontSize: "2rem" }}>TradeSense is a platform that combines social sentiment and financial data to help you make smarter trading decisions.</p>
        </div>
        <h2 ref={(el) => { if (el) animatedItemsRef.current[1] = el; }} className="font-bold text-customColor2 mb-2 relative inline-block" style={{ fontSize: "3rem" }}>
          How Dose It Work?
          <div className="underline-animation"></div>
        </h2>
        <div  className="mt-8 space-y-8 bg-customColor4 p-8 rounded-lg ml-20 mr-20 mb-20 shadow-2xl" ref={(el) => { if (el) animatedItemsRef.current[5] = el; }}>
          <p className=" text-customColor6" style={{ fontSize: "2rem" }}>We analyze social sentiment and financial trends together meaning we can give you Stock predictions and recomend actions based on the analysis of both social media and financial data.</p>
        </div>
        <h2 ref={(el) => { if (el) animatedItemsRef.current[2] = el; }} className="font-bold text-customColor2 mb-2 relative inline-block" style={{ fontSize: "3rem" }}>
          What Are The Features?
          <div className="underline-animation"></div>
        </h2>
        <div className="mt-8 space-y-8 bg-customColor4 p-8 rounded-lg ml-20 mr-20 shadow-2xl" ref={(el) => { if (el) animatedItemsRef.current[6] = el; }}>
          <p className=" text-customColor6" style={{ fontSize: "2rem" }}>Sentiment data from social media, technical indicators, and more. Users can get a general overview of the market or a specific stock.</p>
        </div>
      </div>

      <div ref={(el) => { if (el) sectionRefs.current[1] = el; }} className="mt-20 text-center">
        <h2 ref={(el) => { if (el) animatedItemsRef.current[7] = el; }} className="font-bold text-customColor2 mb-2 relative inline-block" style={{ fontSize: "4rem" }}>
          Pricing Plans
          <div className="underline-animation"></div>
        </h2>
        <div className="pricing-card-container flex gap-8 justify-center mt-8">
          <div className="pricing-card">
            <div className="front">
              <h3 className="text-xl font-semibold text-customColor6">Free Plan</h3>
              <p className="text-gray-600">$0.0/month - Basic access to trading insights</p>
            </div>
            <div className="back">
              <p className="text-gray-600 mb-8">Get started with limited features, perfect for beginners.</p>
              <Link href="/login">
                <AnimatedButton paddinginput="40px 120px">
                  <h2 className="text-xl font-semibold text-customColor2">Get Started for Free</h2>
                </AnimatedButton>
              </Link>
            </div>
          </div>
          <div className="pricing-card">
            <div className="front">
              <h3 className="text-xl font-semibold text-yellow-600">Pro Plan</h3>
              <p className="text-gray-600">$2.99/month - Unlock advanced features</p>
            </div>
            <div className="back">
              <p className="text-gray-600 mb-8">Includes advanced tools, real-time insights, and more.</p>
              <Link href="/login">
                <AnimatedButton paddinginput="40px 120px">
                  <h2 className="text-xl font-semibold text-customColor2">Get Started</h2>
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div ref={(el) => { if (el) sectionRefs.current[2] = el; }} className="mt-20 text-center">
        <Link href="/login">
          <AnimatedButton paddinginput="70px 180px">
            <h2 className="text-3xl font-semibold text-customColor2">Get Started for Free</h2>
          </AnimatedButton>
        </Link>
        <p className="text-customColor2 mt-4 text-2xl">Sign up now and take your trading to the next level.</p>
      </div>

      {/* Add more spacing from the last section to the footer */}
      <div className="mt-20"></div>
    </div>
  );
}