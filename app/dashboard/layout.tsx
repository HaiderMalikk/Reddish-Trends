/* 
- Layout for the website when user is logged in.
This layout defines a different header for the dashboard page. but the smae footer as the default layout.
here i dont define the footer just the header as in the default app layout it checks if we are on the dashboard page 
and if so it dosent show its footer and the dashboard layout will show its own header and the default footer.

- uses cleck to manage the lohout button in the header 
on logout we use clerks signout method to sign the user out and then redirect to the login page.
*/
"use client";
import { useRouter, usePathname } from "next/navigation"; // router for navigation between logged in/out website sections, pathname for highlighting the current page in header
import { useUser, useClerk } from "@clerk/nextjs"; // Import both useUser and useClerk
import Link from "next/link"; // link for navigation between pages
import logo from "../../public/logo.svg"; // Import the logo
import logoAlt from "../../public/logo-w-text-alt.svg"; // Import the logo
import Image from "next/image"; // Import the Image component

// Define the props type for DashboardLayout to include children
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser(); // Use Clerk hook for user management (logout)
  const { signOut } = useClerk(); // Access signOut from useClerk to handle logout
  const router = useRouter(); // Access the router for navigation
  const pathname = usePathname(); // Access the current pathname for routing

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(); // Sign the user out using Clerk's method
      router.replace("/login"); // Redirect to login page after signing out
    } catch (error) {
      console.error("Logout error:", error); // Handle logout errors
    }
  };

  // Loader until the user data is loaded
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-customColor6 font-signature text-customColor2">
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
          {/* navigation links on header (underline on active page) */}
          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className={`hover:text-gray-300 ${
                pathname === "/dashboard" ? "underline" : ""
              }`}
            >
              Dashboard
            </Link>
            {/* profile */}
            <Link
              href="/dashboard/profile"
              className={`hover:text-gray-300 ${
                pathname === "/dashboard/profile" ? "underline" : ""
              }`}
            >
              Profile
            </Link>
            {/* logout */}
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
