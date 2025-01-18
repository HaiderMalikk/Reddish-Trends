// app/layout.js
import Link from "next/link";
import "./styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 p-4 text-white shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-lg font-semibold">My Web App</div>
            <nav className="space-x-4">
              <Link href="/" className="hover:text-gray-300">Home</Link>
              <Link href="/about" className="hover:text-gray-300">About</Link>
              <Link href="/login" className="hover:text-gray-300">Login</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-800 text-white py-4 text-center">
          <h3 className="text-lg font-semibold">Your App Title</h3>
          <p className="mt-2 italic">"Your inspiring slogan goes here"</p>
        </footer>
      </body>
    </html>
  );
}
