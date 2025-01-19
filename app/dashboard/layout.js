'use client';
import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";  // Import both useUser and useClerk
import Link from "next/link";
import logotext from "../../public/logo-w-text.svg";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  const { user, isLoaded } = useUser();  // Use Clerk hook for user management
  const { signOut } = useClerk();  // Access signOut from useClerk
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut();  // Sign the user out using Clerk's method
      router.replace("/login");  // Redirect to login page after signing out
    } catch (error) {
      console.error("Logout error:", error);  // Handle logout errors
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;  // Wait until the user data is loaded
  }

  return (
    <div className="min-h-screen bg-customBlue text-customWhite font-signature">
      <header className="p-4 shadow-md bg-customDark">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Image
                src={logotext}
                alt="Logo"
                width={170}
                height={170}
                className="mr-4"
              />
            </Link>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link
              href="/dashboard"
              className={`hover:text-gray-300 ${
                pathname === "/dashboard" ? "underline" : ""
              }`}
            >
              Dashboard
            </Link>
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
