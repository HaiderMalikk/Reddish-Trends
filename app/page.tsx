"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import logotext from "../public/logo-w-text.svg";
import logocursor from "../public/logo-alt.svg";
import image1 from "../public/feature1.webp";
import image2 from "../public/feature2.webp";
import image3 from "../public/feature3.webp";
import altharionlogo from "../public/altharion-logo.svg";
import linklogo from "../public/link-black.svg";
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
                window.innerWidth < 768 ? `top ${90 + index * 10}%` : "top 90%", // Adjust for mobile as the index inc i.e as we traverse down the page the top% should increase
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
              start: window.innerWidth < 768 ? "top 200%" : "top 90%", // Adjust for mobile as the index here is 0 and we are quite far down i must inc it manually
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
              start: window.innerWidth < 768 ? "top 200%" : "top 90%", // Adjust for mobile as the index here is 0 and we are quite far down i must inc it manually
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
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-customColor2">
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
        <p className="mx-4 mb-10 text-4xl text-customColor3 sm:mx-20 md:mx-40 lg:mx-60">
          Welcome to TradeSense – the future of trading.
        </p>
        <p className="mx-4 text-2xl text-customColor6 sm:mx-20 md:mx-40 lg:mx-60">
          TradeSense combines social sentiment and financial data to help you
          make smarter trading decisions. it takes the guesswork out of the
          stock market. by providing you with the most accurate and up-to-date
          information that takes into account both social sentiment and
          financial data. Get the edge you need to succeed in the stock market.
        </p>
        {/* Powered by Altharion */}
        <div
          ref={(el) => {
            if (el) sectionRefs.current[3] = el;
          }}
          className="mt-20"
        >
          <p className="mx-4 text-2xl text-customColor6 sm:mx-20 md:mx-40 lg:mx-60">
            Powered by Altharion, a cutting-edge AI Market Analyst.
          </p>
          <div className="flex flex-row items-center justify-center">
            <Image
              src={altharionlogo}
              alt="Altharion Logo"
              width={400}
              height={400}
              className="alth-logo"
              // link to repo
              onClick={() => {
                window.open(
                  "https://github.com/HaiderMalikk/Altharion",
                  "_blank",
                );
              }}
            ></Image>
            <Image
              src={linklogo}
              alt="link"
              width={20}
              height={20}
              className="link-logo"
              // link to repo
              onClick={() => {
                window.open(
                  "https://github.com/HaiderMalikk/Altharion",
                  "_blank",
                );
              }}
            ></Image>
          </div>
          <div className="mt-6 text-customColor6">
              <a className="text-xl">Whats New ?</a>
              <div className="mt-4 text-customColor6">
              <a className="text-customColor3 text-xl">Altharion Model √A Version 1.0</a>
              <p className="mx-4 text-md mt-2 sm:mx-20 md:mx-40 lg:mx-60">
              Altharion Model √A can analyze any financial subreddit and make sense of what the market situation is based on the Redditors and conversations in those communities. 
              It can then recommend best, worst and upcoming stocks from the subreddit. It also uses Yahoo Finance API to get information on the stocks
              mentioned in the subreddits to see there current situation and predict the future of the stock.
              </p>
              </div>
          </div>
        </div>
      </div>
      <div className="mt-20 flex w-full flex-wrap justify-around p-6 text-center">
        <div
          className="mb-8 flex w-full flex-col items-center sm:mb-0 sm:w-1/3 sm:px-4"
          ref={(el) => {
            if (el) sectionRefs.current[4] = el;
          }}
        >
          <Image
            src={image1}
            alt="Image 1"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <p className="mt-4 max-w-[350px] px-4 text-customColor6 sm:px-0">
            <strong>Hybrid Market Analysis</strong> – We analyze social
            sentiment and financial trends together and recommend actions based
            on both.
          </p>
        </div>
        <div
          className="mb-8 flex w-full flex-col items-center sm:mb-0 sm:w-1/3 sm:px-4"
          ref={(el) => {
            if (el) sectionRefs.current[5] = el;
          }}
        >
          <Image
            src={image2}
            alt="Image 2"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <p className="mt-4 max-w-[350px] px-4 text-customColor6 sm:px-0">
            <strong>Comprehensive Market Overview</strong> – Sentiment data from
            social media, technical indicators, and more. Users can get a
            general overview of the market or a specific stock.
          </p>
        </div>
        <div
          className="flex w-full flex-col items-center sm:w-1/3 sm:px-4"
          ref={(el) => {
            if (el) sectionRefs.current[6] = el;
          }}
        >
          <Image
            src={image3}
            alt="Image 3"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <p className="mt-4 max-w-[350px] px-4 text-customColor6 sm:px-0">
            <strong>LLM-Driven Predictions</strong> – We combine all data
            sources and run them through an advanced LLM trained on past events
            to generating accurate stock recommendations.
          </p>
        </div>
      </div>
      <div
        ref={(el) => {
          if (el) sectionRefs.current[7] = el;
        }}
        className="mt-20 px-4 text-center"
      >
        <h2
          ref={(el) => {
            if (el) underlinedItemsRef.current[0] = el;
          }}
          className="underline-text relative inline-block font-bold text-customColor6"
        >
          Level Up Your Trading
          <div className="underline-animation"></div>
        </h2>
        <div
          className="pricing-card-container mt-6 flex justify-center gap-8"
          ref={(el) => {
            if (el) sectionRefs.current[8] = el;
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
                and stock market analysis.
              </p>
              <Link href="/login">
                <AnimatedButton
                  paddinginput="buttonpadding2"
                  Buttoncolor="#f5efe7"
                >
                  <h2 className="text-xl font-semibold text-customColor6">
                    Get Started for Free
                  </h2>
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
                - Social Sentiment Analysis
                <br />
                - Stock Market Analysis
                <br />
                - Hybrid Market Analysis
                <br />
                - Comprehensive Market Overview
                <br />
                - LLM-Driven Predictions
                <br />
                - Stock Recommendations
                <br />
                - Real-time Updates
                <br />
                - User Profiles
                <br />- And Much More!
              </p>
              <Link href="/login">
                <AnimatedButton
                  paddinginput="buttonpadding2"
                  Buttoncolor="#f5efe7"
                >
                  <h2 className="text-xl font-semibold text-customColor6">
                    Get Started
                  </h2>
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={(el) => {
          if (el) sectionRefs.current[9] = el;
        }}
        className="mt-24 text-center"
      >
        <Link href="/login" className="custombutton">
          <AnimatedButton paddinginput="buttonpadding" Buttoncolor="">
            <h2 className="text-3xl font-semibold text-customColor2">
              Get Started for Free
            </h2>
          </AnimatedButton>
        </Link>
        <p className="twoxlpadded mt-4 text-2xl text-customColor6">
          Sign up now and take your trading to the next level.
        </p>
      </div>
      {/* Add more spacing from the last section to the footer */}
      <div className="mt-20"></div>
    </div>
  );
}
