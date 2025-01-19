// app/login/[[...rest]]/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser(); // Check if the user is logged in

  useEffect(() => {
    if (isLoaded && user) {
      // Redirect to the dashboard if the user is logged in
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-customBlue">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <SignIn 
          afterSignInUrl="/dashboard" // Redirect to the dashboard after sign-in
          afterSignUpUrl="/dashboard" // Redirect to the dashboard after sign-up
        />
      </div>
    </div>
  );
}
