/* 
Login page

ues clerk to login
*/

'use client';

import { useEffect } from "react"; // Import the useEffect hook for routing to the dashboard
import { useRouter } from "next/navigation"; // Import the useRouter hook for navigation
import { ClerkProvider, SignIn } from "@clerk/nextjs"; // Import Clerk components for sign-in
import { useUser } from "@clerk/nextjs"; // Import useUser hook for user info

// Type for Clerk user and loading state
interface User {
  // Define types for user object if necessary in the future
}

export default function LoginPage() {
  const router = useRouter(); // Access the router for navigation
  const { user, isLoaded } = useUser(); // Check if the user is logged in

  // Check if the user is logged in, if so, redirect to the dashboard
  useEffect(() => {
    if (isLoaded && user) {
      // Redirect to the dashboard if the user is logged in
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  return (
    // Wrapped in Clerk provider for user authentication
    <ClerkProvider>
      <div className="flex items-center justify-center min-h-screen bg-customColor1">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl text-customColor2 font-signature">Welcome to the Clerk Login Page</h1>
          <p className="text-customColor2 text-lg font-signature">Please sign in to access the dashboard</p>
        </div>
        <div className="p-12 bg-customColor2 rounded-lg shadow-lg">
          {/* Use Clerk to handle sign-in */}
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-slate-500 hover:bg-slate-200 text-sm',
              },
            }}
            afterSignInUrl="/dashboard" // Redirect to the dashboard after sign-in
            afterSignUpUrl="/dashboard" // Redirect to the dashboard after sign-up
          />
        </div>
      </div>
    </ClerkProvider>
  );
}
