import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserFavorites } from "./UserFavs";
import { useCommonUser } from "./UserContext";

// Define types for the user data
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  message: string;
  createdAt: string | null;
  favorites: {
    symbol: string;
    companyName: string;
  }[];
}

export default function GetUserData() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const { commonUser, loading: contextLoading } = useCommonUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get email for favorites - use the appropriate user object
  const email = commonUser?.email || user?.primaryEmailAddress?.emailAddress;

  // For guest users, we'll use an empty array for favorites
  // Only use the favorites hook for non-guest users
  const isGuest = email?.endsWith('.temp') || false;
  const { favorites, loading: favsLoading } = useUserFavorites(isGuest ? undefined : email);

  useEffect(() => {
    // If either common user or clerk user is available (and loaded), proceed
    if ((clerkLoaded && user) || (!contextLoading && commonUser)) {
      setLoading(true);
      
      // Handle guest users completely separate from Firebase
      if (commonUser?.email?.endsWith('.temp')) {
        // For guest users, just create a local user data object with no Firebase interaction
        setUserData({
          firstName: commonUser?.firstName || "Guest",
          lastName: commonUser?.lastName || "User",
          email: commonUser?.email || "",
          profileImageUrl: commonUser?.imageUrl || null,
          message: "Welcome, guest user! Create an account to save your preferences and history.",
          createdAt: null,
          favorites: [], // Empty favorites for guest users
        });
        setLoading(false);
        return;
      }

      // For normal users, continue with existing Firebase logic
      const checkOrCreateUser = async () => {
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: commonUser?.email || user?.primaryEmailAddress?.emailAddress,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            // Use commonUser if available, otherwise fall back to clerk user
            const firstName = commonUser?.firstName || user?.firstName || "User";
            const lastName = commonUser?.lastName || user?.lastName || "";
            const userEmail = commonUser?.email || user?.primaryEmailAddress?.emailAddress || "";
            const profileImageUrl = commonUser?.imageUrl || user?.imageUrl || null;
            const message = data.userExists
              ? `User found. Welcome back, ${firstName} ${lastName}!`
              : `New user profile created. Welcome, ${firstName} ${lastName}!`;

            const createdAt =
              data.userExists && data.createdAt
                ? new Date(data.createdAt).toLocaleString()
                : null;

            setUserData({
              firstName,
              lastName,
              email: userEmail,
              profileImageUrl,
              message,
              createdAt,
              favorites: favorites || [],
            });
          } else {
            console.error("Error:", data);
            setUserData({
              firstName: "",
              lastName: "",
              email: "",
              profileImageUrl: null,
              message: `Error: ${data.message}`,
              createdAt: null,
              favorites: [],
            });
          }
        } catch (error) {
          console.error("Error checking or creating user:", error);
          setUserData({
            firstName: "",
            lastName: "",
            email: "",
            profileImageUrl: null,
            message: "Error checking or creating user",
            createdAt: null,
            favorites: [],
          });
        } finally {
          setLoading(false);
        }
      };

      checkOrCreateUser();
    }
  }, [clerkLoaded, user, contextLoading, commonUser, favorites, isGuest]);

  return { userData, loading: isGuest ? loading : (loading || favsLoading) };
}
