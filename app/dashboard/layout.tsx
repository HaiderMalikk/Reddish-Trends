/* 
- Layout for the website when user is logged in.
This layout defines a different header for the dashboard page. but the smae footer as the default layout.
here i dont define the footer just the header as in the default app layout it checks if we are on the dashboard page 
and if so it dosent show its footer and the dashboard layout will show its own header and the default footer.

- uses cleck to manage the lohout button in the header 
on logout we use clerks signout method to sign the user out and then redirect to the login page.
*/
'use client';
import { useRouter, usePathname } from "next/navigation"; // router for navigation between logged in/out website sections, pathname for highlighting the current page in header
import { useUser, useClerk } from "@clerk/nextjs";  // Import both useUser and useClerk
import Link from "next/link"; // link for navigation between pages 
import logotext from "../../public/logo-w-text.svg"; // Import the logo image
import Image from "next/image"; // Import the Image component

// Define the props type for DashboardLayout to include children
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();  // Use Clerk hook for user management (logout)
  const { signOut } = useClerk();  // Access signOut from useClerk to handle logout
  const router = useRouter(); // Access the router for navigation
  const pathname = usePathname(); // Access the current pathname for routing

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut();  // Sign the user out using Clerk's method
      router.replace("/login");  // Redirect to login page after signing out
    } catch (error) {
      console.error("Logout error:", error);  // Handle logout errors
    }
  };

  // Loader until the user data is loaded
  if (!isLoaded) {
    return <div>Loading...</div>;  
  }

  return (
    <div className="min-h-screen bg-customBlue text-customWhite font-signature">
      <header className="p-4 shadow-md bg-customDark">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            {/* logo on header */}
            <Link href="/">
              <Image
                src={logotext}
                alt="Logo"
                width={170}
                height={170}
                className="mr-4"
              />
            </Link>
          </div>
          {/* navigation links on header (underline on active page) */}
          <nav className="space-x-4 flex items-center">
            <Link
              href="/dashboard"
              className={`hover:text-gray-300 ${
                pathname === "/dashboard" ? "underline" : ""
              }`}
            >
              Dashboard
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
