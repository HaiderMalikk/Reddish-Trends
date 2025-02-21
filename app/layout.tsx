/* 
Root layout for the part of the website that is not logged in.
This layout defines a different header for the dashboard page.
but the same global footer is defined in this layout.

- Wrapped in clrek provider so that any page in the website can use clerk to login + passes the publishable key to the clerk provider.
- uses poppins font so that the whole website uses the same font unless specified otherwise.
- imports styles so that the whole website uses the same global styles.
*/
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Import the usePathname hook for highlighting the active link
import "./styles/globals.css"; // Import global styles
import logo from "../public/logo.svg"; // Import the logo
import logoAlt from "../public/logo-w-text-alt.svg"; // Import the logo
import Image from "next/image"; // Import the Image component
import Link from "next/link"; // Import the Link component to navigate between pages while in loggout state
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClerkProvider } from "@clerk/nextjs"; // Import Clerk provider
import { Poppins } from "next/font/google"; // Import the Poppins font
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

gsap.registerPlugin(ScrollTrigger);

// Define the Poppins font with the specified weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// Type for RootLayout props
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname(); // Get the current pathname to highlight the active link
  const isDashboard = pathname?.startsWith("/dashboard") ?? false; // Check if the current page is the dashboard as dashboard has a different header

  useEffect(() => {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      toggleClass: {
        className: "main-tool-bar--scrolled",
        targets: ".main-tool-bar",
      },
    });
  }, []);

  return (
    // wrapped in clerk provider to use clerk
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      // clerk config
      appearance={{
        variables: {
          colorBackground: "#F5F5F5",
          fontSize: "16px",
          colorPrimary: "#000",
        },
        layout: {
          logoImageUrl: "logo-bg.svg",
          
          privacyPageUrl: "/policy",
          termsPageUrl: "/licence",
        },
      }}
    >
      <html lang="en" className={poppins.variable}>
        {/* meta tags for SEO */}
        <Head>
          <title>Trade Sense AI - AI-Powered Stock Predictions</title>
          <meta
            name="description"
            content="Trade Sense AI combines social sentiment analysis and financial data to provide accurate stock predictions and recommendations."
          />
          <meta
            name="keywords"
            content="stock predictions, AI trading, machine learning, finance, sentiment analysis, stock market, investment, trading bot"
          />
          <meta name="author" content="Haider Malik" />

          {/* Open Graph Meta Tags for Social Media */}
          <meta
            property="og:title"
            content="Trade Sense AI - AI-Powered Stock Predictions"
          />
          <meta
            property="og:description"
            content="A hybrid stock prediction system that combines financial data and social sentiment analysis for smarter trading insights."
          />
          <meta property="og:image" content="../public/logo-bg.svg" />
          <meta
            property="og:url"
            content="https://trade-sense-ai-sigma.vercel.app/"
          />
          <meta property="og:type" content="website" />

          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Trade Sense AI - AI-Powered Stock Predictions"
          />
          <meta
            name="twitter:description"
            content="A stock market AI tool that analyzes financial data & social sentiment to predict stock movements."
          />
          <meta name="twitter:image" content="../public/logo-bg.svg" />

          {/* Favicon */}
          <link rel="icon" href="./favicon.ico" />
        </Head>
        <body className="min-h-screen bg-customColor6 font-signature text-customColor2">
          {/* keep font global but keep dashboard header separate (will apply to all the pages in the website once user logs in) */}
          {!isDashboard && (
            <header className="main-tool-bar p-4 text-customColor2">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <a href="/">
                    <Image
                      src={logoAlt}
                      alt="Logo"
                      className="header-logo desktop-logo"
                    />
                    <Image
                      src={logo}
                      alt="Logo"
                      className="header-logo mobile-logo"
                    />
                  </a>
                </div>
                <nav className="flex items-center space-x-4">
                  {/* no link for home page its a hard refresh */}
                  <a
                    href="/"
                    className={`hover:text-gray-300 ${pathname === "/" ? "underline" : ""}`}
                  >
                    Home
                  </a>

                  <Link
                    href="/login"
                    className={`hover:text-gray-300 ${pathname === "/login" ? "underline" : ""}`}
                  >
                    Login
                  </Link>
                </nav>
              </div>
            </header>
          )}
          {/* main content with default margin due to header */}
          <main className="pt-16">
            {children}
            <Analytics />
          </main>
          {/* Added padding-top to main content */}
          {/* global footer */}
          <footer className="custom-footer">
            <div className="mx-auto flex max-w-5xl flex-col justify-between md:flex-row">
              {/* Left Section: Hello + Name */}
              <div className="md:w-1/2">
                <h1 className="text-customWhite font-serif text-6xl">Hello</h1>
                <p className="project-description mt-4">
                  Trade Sense AI, a project of{" "}
                  <a
                    className="text-customWhite underline hover:text-gray-300"
                    href="https://haidermalikk.github.io/HaiderMaliksWebsite/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Haider Malik
                  </a>
                </p>
              </div>

              {/* Right Section: Contact & Resources Centered */}
              <div className="mt-8 flex flex-col justify-between md:mt-0 md:w-1/2 md:flex-row">
                <div className="contact-resources text-center md:mr-8 md:text-left">
                  <h2 className="text-customWhite text-xl font-semibold">
                    Contact
                  </h2>
                  <p className="mt-2">
                    <Link
                      href="mailto:tradesenseai@googlegroups.com?subject=Contact%20from%20Website"
                      className="text-customWhite underline hover:text-gray-300"
                    >
                      Contact Us
                    </Link>
                  </p>
                </div>

                <div className="contact-resources text-center md:text-left">
                  <h2 className="text-customWhite text-xl font-semibold">
                    Resources
                  </h2>
                  <ul className="mt-2 space-y-2">
                    <li>
                      <Link
                        href="/policy"
                        className="text-customWhite underline hover:text-gray-300"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/licence"
                        className="text-customWhite underline hover:text-gray-300"
                      >
                        License
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="text-customWhite underline hover:text-gray-300"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <a
                        className="text-customWhite underline hover:text-gray-300"
                        href="https://github.com/HaiderMalikk/Trade-Sense-AI"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source Code
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-customWhite underline hover:text-gray-300"
                        href="https://github.com/HaiderMalikk/Altharion"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Altharion AI Model
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
