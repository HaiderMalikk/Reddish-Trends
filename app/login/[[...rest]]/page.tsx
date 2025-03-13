"use client";

import { useEffect, useState } from "react"; // Import the useEffect and useState hooks
import { useRouter } from "next/navigation"; // Import the useRouter hook for navigation
import { useUser, ClerkProvider, SignIn } from "@clerk/nextjs"; // Import Clerk components for sign-in and userData
import ".././../styles/login-page-style.css";

export default function LoginPage() {
  const router = useRouter(); // Access the router for navigation
  const { user, isLoaded } = useUser(); // Check if the user is logged in
  const [isLoading, setIsLoading] = useState(true); // State to manage loading

  // Check if the user is logged in, if so, redirect to the dashboard
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false); // Set loading to false once Clerk is loaded
      if (user) {
        // Redirect to the dashboard if the user is logged in
        router.push("/dashboard");
      }
    }
  }, [user, isLoaded, router]);

  return (
    // Wrapped in Clerk provider for user authentication
    <ClerkProvider>
      {isLoading ? (
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
          <h1 className="text-white">Loading...</h1>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-reddish">
          <h1 className="mb-4 text-4xl font-bold text-customColor6">
            Coming Very Soon! Check back later.
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
      )}
    </ClerkProvider>
  );
}
