// RootLayout.js
'use client';
import { Poppins } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'; 
import { usePathname } from 'next/navigation';
import "./styles/globals.css";
import logotext from "../public/logo-w-text.svg";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Add weights based on your usage
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className={poppins.variable}>
        <body className="min-h-screen bg-customBlue text-customWhite font-signature">
          {!isDashboard && (
            <header className="p-4 shadow-md bg-customDark">
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
          <main>{children}</main>
          <footer className="bg-customDark text-white py-4 text-center">
            <h3 className="text-lg font-semibold">
              Trade Sense AI, a project of{" "}
              <a
                className="text-customBlue hover:underline"
                href="https://github.com/HaiderMalikk"
                target="_blank"
                rel="noopener noreferrer"
              >
                Haider Malik
              </a>
            </h3>
            <a
              className="text-customBlue hover:underline"
              href="https://github.com/HaiderMalikk/Trade-Sense-AI"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code Link
            </a>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
