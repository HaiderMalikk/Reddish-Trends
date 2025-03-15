/* 
- Layout for the website when user is logged in.
This layout defines a different header for the dashboard page. but the smae footer as the default layout.
here i dont define the footer just the header as in the default app layout it checks if we are on the dashboard page 
and if so it dosent show its footer and the dashboard layout will show its own header and the default footer.

- uses cleck to manage the lohout button in the header 
on logout we use clerks signout method to sign the user out and then redirect to the login page.
*/
"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // router for navigation between logged in/out website sections, pathname for highlighting the current page in header
import { useUser, useClerk } from "@clerk/nextjs"; // Import both useUser and useClerk
import Link from "next/link"; // link for navigation between pages
import logo from "../../public/logo.svg"; // Import the logo
import logoAlt from "../../public/logo-w-text.svg"; // Import the logo
import Image from "next/image"; // Import the Image component
import "./styles/layout-styles.css";

// Define the props type for DashboardLayout to include children
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser(); // Use Clerk hook for user management (logout)
  const { signOut } = useClerk(); // Access signOut from useClerk to handle logout
  const router = useRouter(); // Access the router for navigation
  const pathname = usePathname(); // Access the current pathname for routing
  const [loggingOut, setLoggingOut] = useState(false); // State to manage logout process
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  // Function to handle logout
  const handleLogout = async () => {
    setLoggingOut(true); // Set logging out state to true
    try {
      await signOut(); // Sign the user out using Clerk's method
      router.replace("/login"); // Redirect to login page after signing out
    } catch (error) {
      console.error("Logout error:", error); // Handle logout errors
      setLoggingOut(false); // Reset logging out state if there's an error
    }
  };

  // Loader until the user data is loaded
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        {/* Spinner */}
        <div className="spinner m-8">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h1 className="text-customColor2">Loading...</h1>
      </div>
    );
  }

  // Show loading screen during logout process
  if (loggingOut) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        {/* Spinner */}
        <div className="spinner m-8">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h1 className="text-customColor2">Logging out...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-customColor6 font-signature">
      <header className="main-tool-bar p-4 text-customColor2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            {/* logo on header */}
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
          {/* Desktop navigation */}
          <nav className="hidden items-center space-x-4 md:flex">
            <Link
              href="/dashboard"
              className={`hover:text-gray-300 ${
                pathname === "/dashboard" ? "underline" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/playground"
              className={`hover:text-gray-300 ${
                pathname === "/dashboard/playground" ? "underline" : ""
              }`}
            >
              Playground
            </Link>
            <Link
              href="/dashboard/profile"
              className={`hover:text-gray-300 ${
                pathname === "/dashboard/profile" ? "underline" : ""
              }`}
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          </nav>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hamburger-button"
              aria-label="Toggle menu"
            >
              <div
                className={`hamburger-line ${mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
              ></div>
              <div
                className={`hamburger-line ${mobileMenuOpen ? "opacity-0" : ""}`}
              ></div>
              <div
                className={`hamburger-line ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
              ></div>
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="flex flex-col items-center space-y-4 p-4">
              <Link
                href="/dashboard"
                className={`mobile-menu-item ${
                  pathname === "/dashboard" ? "font-bold underline" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/playground"
                className={`mobile-menu-item ${
                  pathname === "/dashboard/playground"
                    ? "font-bold underline"
                    : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Playground
              </Link>
              <Link
                href="/dashboard/profile"
                className={`mobile-menu-item ${
                  pathname === "/dashboard/profile" ? "font-bold underline" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mobile-menu-item text-left"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
