"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import useUserData from "../../hooks/GetUserData"; // user data hook
import { useUser } from "@clerk/nextjs"; // Import both useUser for clerk user management
import { useRouter } from "next/navigation"; // Correct import for useRouter
import "../styles/home-page-styles.css";
import defaultPP from "../../../public/defaultprofilepic.svg";

export default function Profile() {
  const { userData, loading } = useUserData(); // get user data
  const { user } = useUser(); // Use Clerk hook for user management (logout)
  const router = useRouter(); // Access the router for navigation

  // If user is not logged in, show a message and redirect after 1 second
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <h1 className="text-white">
          Please log in to view this page. Redirecting you to the login page...
        </h1>
      </div>
    );
  }

  // Show loading screen while user data is loading
  if (loading || !userData) {
    return (
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
    );
  }

  // Show error screen if an error occurred
  if (userData.message.startsWith("Error")) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black">
        {/* Error message Error, then error then recommendation */}
        <h1 className="text-4xl font-semibold text-red-600">Error</h1>
        {/* error message */}
        <p className="mt-4 text-lg text-white">{userData.message}</p>
        {/* recommendation */}
        <p className="mt-4 text-lg text-gray-300">
          Please try refreshing the page or trying again later. If the problem
          persists, please contact us using the contact info at the bottom of
          the page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-customColor4 p-6">
      <div className="mx-auto max-w-4xl w-full rounded-lg bg-white p-12 text-gray-700 shadow-md text-center mb-10">
        <h1 className="text-6xl font-semibold">Profile</h1>
        <p className="mt-4 text-xl">
          Welcome, {userData.firstName} {userData.lastName}!
        </p>
      </div>

      <div className="mx-auto max-w-4xl rounded-lg bg-customColor2 p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Image
            src={userData.profileImageUrl ?? defaultPP}
            height={128}
            width={128}
            alt="Profile"
            className="mx-auto h-32 w-32 rounded-full border-4 border-customColor6"
          />
          <p className="mt-4 text-lg text-gray-700">
            <strong>First Name:</strong> {userData.firstName}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Last Name:</strong> {userData.lastName}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Email:</strong> {userData.email}
          </p>
          {userData.createdAt && (
            <p className="text-lg text-gray-700">
              <strong>Account Created At:</strong> {userData.createdAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
