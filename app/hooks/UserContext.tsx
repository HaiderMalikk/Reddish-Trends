"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { getCookie } from "cookies-next";

// Define common user interface for both Clerk and guest users
export interface CommonUser {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
  isGuest: boolean;
}

// Context type definition
interface UserContextType {
  commonUser: CommonUser | null;
  loading: boolean;
  isUserLoggedIn: boolean;
  setCommonUser: (user: CommonUser) => void;
}

// Create the context
const UserContext = createContext<UserContextType>({
  commonUser: null,
  loading: true,
  isUserLoggedIn: false,
  setCommonUser: () => {},
});

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const [commonUser, setCommonUser] = useState<CommonUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to check user status
    const checkUserStatus = async () => {
      // If clerk is still loading, do nothing yet
      if (!clerkLoaded) return;

      // Check if user is authenticated with Clerk
      if (clerkUser) {
        // Authenticated user logic
        setCommonUser({
          firstName: clerkUser.firstName || "User",
          lastName: clerkUser.lastName || "",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          imageUrl: clerkUser.imageUrl || null,
          isGuest: false,
        });
      } else {
        // Check if there's a guest user cookie
        const isGuest = getCookie("guestUser");
        const guestEmail = getCookie("userEmail");

        if (isGuest && guestEmail && typeof guestEmail === "string") {
          // If it's a guest user with a temporary email
          setCommonUser({
            firstName: "Reddish",
            lastName: "User",
            email: guestEmail, // Use the temporary email from cookie
            imageUrl: null,
            isGuest: true,
          });
        } else {
          setCommonUser(null);
        }
      }

      setLoading(false);
    };

    checkUserStatus();
  }, [clerkUser, clerkLoaded]);

  return (
    <UserContext.Provider
      value={{
        commonUser,
        loading,
        isUserLoggedIn: !!commonUser,
        setCommonUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useCommonUser() {
  return useContext(UserContext);
}
