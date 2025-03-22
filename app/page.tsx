"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import logotext from "../public/logo-w-text.svg";
import logocursor from "../public/logo.svg";
import image1 from "../public/feature1.png";
import image2 from "../public/feature2.png";
import image3 from "../public/feature3.png";
import AnimatedButton from "./components/AnimatedButton";
import ThreeScene from "./components/ThreeScene";
import Link from "next/link";
import "./styles/main-page-styles.css";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const underlinedItemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Apply ScrollTrigger animation to each section
    sectionRefs.current.forEach((section, index) => {
      if (section) {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start:
                window.innerWidth < 768
                  ? `top ${90 + index * 9}%`
                  : `top ${90 + index}%`, // Adjust for mobile as the index inc i.e as we traverse down the page the top% should increase
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    // Animate the items when they come into view
    underlinedItemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: window.innerWidth < 768 ? "top 250%" : "top 100%", // Adjust for mobile as the index here is 0 and we are quite far down i must inc it manually
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        );
        const underline = item.querySelector(".underline-animation");

        gsap.fromTo(
          underline,
          { width: "-50%" },
          {
            width: "100%",
            duration: 0.5,
            ease: "bounce.inOut",
            scrollTrigger: {
              trigger: item,
              start: window.innerWidth < 768 ? "top 250%" : "top 100%", // Adjust for mobile as the index here is 0 and we are quite far down i must inc it manually
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    gsap.set(".flair", { xPercent: -25, yPercent: -25, zIndex: 10000 });

    let xTo = gsap.quickTo(".flair", "x", { duration: 0.6, ease: "power3" }),
      yTo = gsap.quickTo(".flair", "y", { duration: 0.6, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-reddish">
      {/* Custom mouse effect */}
      <div className="flair">
        <Image src={logocursor} alt="Logo" width={30} height={30} />
      </div>{" "}
      <div className="w-full">
        <ThreeScene />
      </div>
      <div
        ref={(el) => {
          if (el) sectionRefs.current[0] = el;
        }}
        className="mb-2 mt-2 px-4 pt-20 text-center"
      >
        <Image
          ref={(el) => {
            if (el) sectionRefs.current[1] = el;
          }}
          src={logotext}
          alt="Logo"
          width={800}
          height={800}
          className="mx-auto mb-8 mt-4 max-w-full"
          style={{ opacity: 0 }}
        />
      </div>
      <div
        ref={(el) => {
          if (el) sectionRefs.current[2] = el;
        }}
        className="mt-6 w-full p-7 text-center"
      >
        {/* catchy line to intoduce */}
        <p className="mx-4 mb-10 text-4xl text-customColor4 sm:mx-20 md:mx-40 lg:mx-60">
          Welcome to Reddish Trends - A Reddit Powered Market Analysis Platform.
        </p>
        <p className="mx-4 text-2xl text-customColor2 sm:mx-20 md:mx-40 lg:mx-60">
          Reddish Trends combines social sentiment and financial data to help
          you make smarter trading decisions. it takes advantage of the power of
          the Reddit community to provide insights into the market. It uses AI
          to make predictions on the future of the stock and provides you with
          the best, worst, and upcoming stocks based on our analysis. It also
          provides you with a comprehensive market overview, including price
          changes, highs/lows, and more. It also includes a playground for you
          to analyze any subreddit for any stock with highly customizable
          settings.
        </p>
      </div>
      <div className="mt-20 flex w-full flex-wrap justify-around p-6 text-center">
        <div
          className="mb-8 flex w-full flex-col items-center sm:mb-0 sm:w-1/3 sm:px-4"
          ref={(el) => {
            if (el) sectionRefs.current[3] = el;
          }}
        >
          <Image
            src={image1}
            alt="Image 1"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <p className="mt-4 max-w-[350px] px-4 text-customColor2 sm:px-0">
            <strong>Social Sentiment Analysis</strong> – We use social media
            like Reddit to gauge the sentiment of the market. we use posts and
            comments from popular subreddits to analyze the sentiment of the
            market and provide you with insights into the market sentiment.
          </p>
        </div>
        <div
          className="mb-8 flex w-full flex-col items-center sm:mb-0 sm:w-1/3 sm:px-4"
          ref={(el) => {
            if (el) sectionRefs.current[4] = el;
          }}
        >
          <Image
            src={image2}
            alt="Image 2"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <p className="mt-4 max-w-[350px] px-4 text-customColor2 sm:px-0">
            <strong>Financial Analysis</strong> – We use the social media data
            and combine it with financial data to provide you with a
            comprehensive market overview. things like price changes, high/lows,
            and more are all taken into account to provide you a brief overview.
          </p>
        </div>
        <div
          className="flex w-full flex-col items-center sm:w-1/3 sm:px-4"
          ref={(el) => {
            if (el) sectionRefs.current[5] = el;
          }}
        >
          <Image
            src={image3}
            alt="Image 3"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <p className="mt-4 max-w-[350px] px-4 text-customColor2 sm:px-0">
            <strong>AI-Driven Predictions</strong> – We combine all the data
            together and use AI models to make predictions on the future of the
            stock. we provide you with the best, worst, and upcoming stocks
            based on our analysis and predictions for each one.
          </p>
        </div>
      </div>
      <div
        ref={(el) => {
          if (el) sectionRefs.current[6] = el;
        }}
        className="mt-20 px-4 text-center"
      >
        <h2
          ref={(el) => {
            if (el) underlinedItemsRef.current[0] = el;
          }}
          className="underline-text relative inline-block font-bold text-customColor2"
        >
          Level Up Your Trading
          <div className="underline-animation"></div>
        </h2>
        <div
          className="pricing-card-container mt-6 flex justify-center gap-8"
          ref={(el) => {
            if (el) sectionRefs.current[7] = el;
          }}
        >
          <div className="pricing-card">
            <div className="front space-y-2">
              <h3 className="text-xl font-semibold text-customColor6">
                Completly Free!
              </h3>
              <p className="text-gray-600">
                This Project is Open Source, Free and will always be.
              </p>
            </div>
            <div className="back">
              <p className="mb-8 text-gray-600">
                Get a host of features for free, including our social sentiment
                and stock market analysis along with AI predictions + the
                playground to analyze any subreddit for any stock.
              </p>
              <Link href="/login">
                <AnimatedButton
                  paddinginput="p-4 px-8"
                  Buttoncolor="#f5efe7"
                  fontSize="1.2rem"
                >
                  <span className="text-black">Sign Up</span>
                </AnimatedButton>
              </Link>
            </div>
          </div>
          <div className="pricing-card">
            <div className="front space-y-2">
              <h3 className="text-xl font-semibold text-customColor6">
                Features!
              </h3>
              <p className="text-gray-600">
                See a list of all the features we offer. (HOVER OVER ME)
              </p>
            </div>
            <div className="back">
              <p className="mb-8 text-gray-600" style={{ textAlign: "left" }}>
                - Reddit Social Sentiment Analysis
                <br />
                - Stock Market Analysis
                <br />
                - Financial Data Analysis
                <br />
                - Sentiment Overview
                <br />
                - LLM-Driven Predictions
                <br />
                - Stock Recommendations
                <br />
                - Real-time Updates
                <br />
                - User Profiles and Favorites
                <br />
                - Playground with unlimited creativity and possibilities
                <br />- And Much More!
              </p>
              <Link href="/login">
                <AnimatedButton
                  paddinginput="p-4 px-8"
                  Buttoncolor="#f5efe7"
                  fontSize="1.2rem"
                >
                  <span className="text-black">Sign Up</span>
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={(el) => {
          if (el) sectionRefs.current[8] = el;{{}}
        }}
        className="mt-24 text-center"
      >
        <Link href="/login" className="custombutton">
          <AnimatedButton
            paddinginput="p-6 px-20"
            Buttoncolor="#f5efe7"
            fontSize="2rem"
          >
            <span className="text-black">Sign Up</span>
          </AnimatedButton>
        </Link>
        <p className="twoxlpadded mt-4 text-2xl text-customColor2">
          Sign up now and take your trading to the next level.
        </p>
      </div>
      {/* Add more spacing from the last section to the footer */}
      <div className="mt-20"></div>
    </div>
  );
}
