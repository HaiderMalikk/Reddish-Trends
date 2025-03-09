import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserFavorites } from "./UserFavs";

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
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get email for favorites
  const email = user?.primaryEmailAddress?.emailAddress;
  
  // Use the favorites hook
  const { favorites, loading: favsLoading } = useUserFavorites(email);
  
  useEffect(() => {
    if (isLoaded && user) {
      setLoading(true);
      const checkOrCreateUser = async () => {
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            const firstName = user?.firstName ?? "User";
            const lastName = user?.lastName ?? "";
            const email = user.primaryEmailAddress?.emailAddress ?? "";
            const profileImageUrl = user.imageUrl || null;
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
              email,
              profileImageUrl,
              message,
              createdAt,
              favorites: favorites || []
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
              favorites: []
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
            favorites: []
          });
        } finally {
          setLoading(false);
        }
      };

      checkOrCreateUser();
    }
  }, [isLoaded, user, favorites]);

  return { userData, loading: loading || favsLoading };
}
