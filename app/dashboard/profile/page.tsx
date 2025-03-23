"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useUserData from "../../hooks/GetUserData"; // user data hook
import { useUser } from "@clerk/nextjs"; // Import both useUser for clerk user management
import { useCommonUser } from "../../hooks/UserContext";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import "../styles/home-page-styles.css";
import defaultPP from "../../../public/defaultprofilepic.svg";
import { useUserFavorites } from "../../hooks/UserFavs"; // Import the favorites hook
import Toast from "../../components/Toast"; // Import the Toast component

export default function ProfilePage() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { userData, loading } = useUserData(); // get user data
  const { user: clerkUser } = useUser();
  const { commonUser, loading: contextLoading, isUserLoggedIn } = useCommonUser();
  const router = useRouter(); // Access the router for navigation
  
  // Use email from either source
  const email = userData?.email;
  const { removeFavorite, refreshFavorites } = useUserFavorites(email); // Get removeFavorite function

  // Local state for favorites to enable immediate UI updates
  const [localFavorites, setLocalFavorites] = useState<
    Array<{ symbol: string; companyName: string }>
  >([]);

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Update local favorites when userData changes
  useEffect(() => {
    if (userData?.favorites) {
      setLocalFavorites(userData.favorites);
    }
  }, [userData?.favorites]);

  // If user is not logged in, show a message and redirect after 1 second
  useEffect(() => {
    if (!isUserLoggedIn && !contextLoading && !loading) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isUserLoggedIn, contextLoading, loading, router]);

  if (!isUserLoggedIn && !contextLoading && !loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <h1 className="text-customColor2">
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
        <h1 className="text-customColor2">Loading...</h1>
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
        <p className="mt-4 text-lg text-customColor2">{userData.message}</p>
        {/* recommendation */}
        <p className="mt-4 text-lg text-gray-300">
          Please try refreshing the page or trying again later. If the problem
          persists, please contact us using the contact info at the bottom of
          the page.
        </p>
      </div>
    );
  }

  const handleRemoveFavorite = async (symbol: string) => {
    try {
      // Update local state immediately for responsive UI
      setLocalFavorites((prev) => prev.filter((fav) => fav.symbol !== symbol));

      // Show success toast BEFORE the API call to ensure it appears
      setToast({
        show: true,
        message: `${symbol} removed from favorites`,
        type: "success",
      });

      // Make API call to remove the favorite
      await removeFavorite(symbol);

      // Refresh favorites data
      refreshFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);

      // Show error toast
      setToast({
        show: true,
        message: `Failed to remove ${symbol} from favorites`,
        type: "error",
      });

      // Revert the local change if API call failed
      if (userData?.favorites) {
        setLocalFavorites(userData.favorites);
      }
    }
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  // Check if user is a guest
  const isGuestUser = () => {
    return userData.email.endsWith('.temp') || false;
  };
  
  // Return different content for guest users
  if (isGuestUser()) {
    return (
      <div className="profile-container">
        <div className="guest-profile-message">
          <h1>Guest Account</h1>
          <p>Please login to create a profile and access your favorites.</p>
          <p>With a registered account, you can save your favorite subreddits and access them easily.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-reddish p-6">
      {/* Toast notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* welcome message to my 2 person userbase */}
      <div className="mx-auto mb-10 w-full max-w-4xl rounded-lg border-2 border-black bg-customColor4 p-12 text-center text-black shadow-md">
        <h1 className="text-6xl font-semibold">Profile</h1>
        <p className="mt-4 text-gray-600" style={{ fontSize: "1.2rem" }}>
          Welcome, {userData.firstName} {userData.lastName}!
        </p>
      </div>

      <div className="mx-auto max-w-6xl rounded-lg bg-customColor2 p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Image
            src={userData.profileImageUrl ?? defaultPP}
            height={128}
            width={128}
            alt="Profile"
            className="mx-auto h-32 w-32 rounded-full border-4 border-customColor6"
          />
          <p className="mt-4 text-lg text-black">
            <strong>First Name:</strong> {userData.firstName}
          </p>
          <p className="mb-6 text-lg text-black">
            <strong>Last Name:</strong> {userData.lastName}
          </p>
          <p className="flex flex-col items-center text-lg text-black">
            <strong>Email:</strong> {userData.email}
          </p>
          {userData.createdAt && (
            <p className="flex flex-col items-center text-lg text-black">
              <strong>Account Created At:</strong> {userData.createdAt}
            </p>
          )}
        </div>
      </div>

      {/* Favorites Section */}
      <div className="mx-auto mb-8 mt-8 max-w-6xl rounded-lg bg-customColor2 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-black">
          Your Favorite Stocks
        </h2>

        {localFavorites && localFavorites.length > 0 ? (
          <div>
            <table className="min-w-full overflow-hidden rounded-lg bg-white">
              <thead className="bg-customColor6 text-customColor2">
                <tr>
                  <th className="px-4 py-3 text-left">Symbol</th>
                  <th className="px-4 py-3 text-left">Company Name</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {localFavorites.map((fav) => (
                  <tr key={fav.symbol} className="hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-black">
                      {fav.symbol}
                    </td>
                    <td className="px-4 py-3 text-black">{fav.companyName}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveFavorite(fav.symbol)}
                        className="rounded bg-red-500 px-3 py-1 text-customColor2 transition-colors hover:bg-red-600"
                        aria-label={`Remove ${fav.symbol} from favorites`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            You haven't added any favorite stocks yet.
          </p>
        )}
      </div>
    </div>
  );
}
