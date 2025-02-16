/* 
Login page

ues clerk to login
*/

"use client";

import { useEffect } from "react"; // Import the useEffect hook for routing to the dashboard
import { useRouter } from "next/navigation"; // Import the useRouter hook for navigation
import { ClerkProvider, SignIn } from "@clerk/nextjs"; // Import Clerk components for sign-in
import { useUser } from "@clerk/nextjs"; // Import useUser hook for user info
import ".././../styles/login-page-style.css";

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

  if (!isLoaded) {
    // maybe add loading spinner here but null good for error handling
    return null;
  }

  return (
    // Wrapped in Clerk provider for user authentication
    <ClerkProvider>
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-customColor2 pt-14">
        <h1 className="mb-8 text-4xl font-bold text-customColor6">
          Great Things are on the way, Please come back later
        </h1>
        <div className="rounded-lg bg-customColor4 p-12 shadow-lg">
          {/* Use Clerk to handle sign-in */}
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-slate-500 hover:bg-slate-200 text-sm",
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
