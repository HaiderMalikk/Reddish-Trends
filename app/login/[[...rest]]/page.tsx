"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, ClerkProvider, SignIn } from "@clerk/nextjs";
import ".././../styles/login-page-style.css";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is logged in, if so, redirect to the dashboard
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
      if (user) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoaded, router]);

  // Handle guest login
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError(null);

    try {
      // Call the API endpoint for guest login
      const response = await fetch("/api/guest-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard on successful login
        router.push("/dashboard");
      } else {
        console.error("Guest login failed:", data.message);
        setError(data.message || "Guest login failed. Please try again.");
        setGuestLoading(false);
      }
    } catch (error) {
      console.error("Error during guest login:", error);
      setError("Network error. Please check your connection and try again.");
      setGuestLoading(false);
    }
  };

  return (
    // Wrapped in Clerk provider for user authentication
    <ClerkProvider>
      {isLoading || guestLoading ? (
        <div className="flex h-screen items-center justify-center bg-black">
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
      ) : (
        <div className="page flex min-h-screen flex-col items-center justify-center overflow-hidden bg-reddish">
          <div className="rounded-lg bg-customColor4 p-12 shadow-lg">
            {/* Use Clerk to handle sign-in */}
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: {
                    fontSize: 12,
                    textTransform: 'none',
                    backgroundColor: '#f5f5f5',
                    '&:hover, &:focus, &:active': {
                      backgroundColor: '#e5e5e5',
                    },
                  },
                },
              }}
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />

            {/* Guest Login Button */}
            <div className="mt-6 flex flex-col items-center">
              <div className="my-2 flex w-full items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="mx-4 flex-shrink text-gray-600">or</span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              {error && (
                <div className="mb-4 w-full rounded bg-red-100 p-2 text-center text-red-800">
                  {error}
                </div>
              )}

              <button
                onClick={handleGuestLogin}
                className="mt-6 w-full rounded-lg bg-customColor5 px-4 py-2 text-black transition-colors hover:bg-white disabled:opacity-50 shadow-md"
                disabled={guestLoading}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </ClerkProvider>
  );
}
