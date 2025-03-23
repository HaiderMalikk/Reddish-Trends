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
      const response = await fetch('/api/guest-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        console.error('Guest login failed:', data.message);
        setError(data.message || 'Guest login failed. Please try again.');
        setGuestLoading(false);
      }
    } catch (error) {
      console.error('Error during guest login:', error);
      setError('Network error. Please check your connection and try again.');
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
        <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-reddish">
          <h1 className="mb-4 text-center text-4xl font-bold text-customColor6">
            Website Down Till Sunday 23th 7:00 PM EST For Feture Updates. Please
            Check Back Then For a New Update.
          </h1>
          <div className="rounded-lg bg-customColor4 p-12 shadow-lg">
            {/* Use Clerk to handle sign-in */}
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-slate-500 hover:bg-slate-200 text-sm",
                },
              }}
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
            
            {/* Guest Login Button */}
            <div className="mt-6 flex flex-col items-center">
              <div className="my-2 flex w-full items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 flex-shrink text-gray-600">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              {error && (
                <div className="mb-4 w-full rounded bg-red-100 p-2 text-center text-red-800">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleGuestLogin}
                className="w-full rounded bg-slate-500 px-4 py-2 text-white transition-colors hover:bg-slate-600 disabled:opacity-50"
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
