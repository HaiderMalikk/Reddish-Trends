/* 
Root layout for the part of the website that is not logged in.
This layout defines a different header for the dashboard page.
but the same global footer is defined in this layout.

- Wrapped in clrek provider so that any page in the website can use clerk to login + passes the publishable key to the clerk provider.
- uses poppins font so that the whole website uses the same font unless specified otherwise.
- imports styles so that the whole website uses the same global styles.
*/
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import the usePathname hook for highlighting the active link
import "./styles/globals.css"; // Import global styles 
import logotext from "../public/logo-w-text.svg"; // Import the logo 
import Image from "next/image"; // Import the Image component
import Link from "next/link"; // Import the Link component to navigate between pages while in loggout state
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClerkProvider } from '@clerk/nextjs'; // Import Clerk provider
import { Poppins } from "next/font/google"; // Import the Poppins font

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
  const isDashboard = pathname?.startsWith('/dashboard') ?? false; // Check if the current page is the dashboard as dashboard has a different header

  useEffect(() => {
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { className: 'main-tool-bar--scrolled', targets: '.main-tool-bar' }
    });
  }, []);

  return (
    // wrapped in clerk provider to use clerk
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    // clerk config
    appearance={{
        variables: {
          colorBackground: '#F5F5F5',
          fontSize: '16px',
          colorPrimary: '#3E5879',
        },
        layout: {
          logoImageUrl: 'logo-bg.svg',
        }
      }}>
      <html lang="en" className={poppins.variable}> 
        <body className="min-h-screen bg-customColor1 text-customColor5 font-signature">
          {/* keep font global but keep dashboard header separate (will apply to all the pages in the website once user logs in) */}
          {!isDashboard && (
            <header className="main-tool-bar p-4 text-customColor2">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <Link href="/">
                    <Image
                      src={logotext}
                      alt="Logo"
                      width={170}
                      height={170}
                      className="mr-4 cursor-pointer"
                    />
                  </Link>
                </div>
                <nav className="space-x-4 flex items-center">
                  <Link href="/" className={`hover:text-gray-300 ${pathname === '/' ? 'underline' : ''}`}>
                    Home
                  </Link>
                  <Link href="/login" className={`hover:text-gray-300 ${pathname === '/login' ? 'underline' : ''}`}>
                    Login
                  </Link>
                </nav>
              </div>
            </header>
          )}
          <main className="pt-20">{children}</main> {/* Added padding-top to main content */}
          {/* global footer */}
          <footer className="bg-customColor3 text-white py-4 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Trade Sense AI, a project of{" "}
              <a
                className="text-customWhite underline hover:text-gray-300"
                href="https://haidermalikk.github.io/HaiderMaliksWebsite/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Haider Malik
              </a>
            </h3>
            <ul className="list-none">
              <li className="mb-2">
                <Link href="/policy" className="text-customWhite underline hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/licence" className="text-customWhite underline hover:text-gray-300">
                  License
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
            </ul>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}