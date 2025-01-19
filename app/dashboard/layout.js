'use client';
import { useRouter, usePathname } from "next/navigation";  // Ensure correct import
import Image from "next/image";
import Link from "next/link";
import logotext from "../../public/logo-w-text.svg";

export default function DashboardLayout({ children }) {
  const router = useRouter();  // Initialize router
  const pathname = usePathname();

  // Logout function
  const handleLogout = () => {
    // Clear authentication (this could be clearing session, cookies, etc.)
    sessionStorage.clear(); // or localStorage.clear();

    // Redirect to login page after logout
    router.replace("/login");
    // Force a full page reload to ensure state is updated
    window.location.href = "/login";
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-customBlue text-customWhite font-signature">
        <header className="p-4 shadow-md bg-customDark">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
            <Link href="http://localhost:3000">
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
              <Link href="/dashboard" className={`hover:text-gray-300 ${pathname === '/dashboard' ? 'underline' : ''}`}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </nav>
          </div>
        </header>
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
  );
}