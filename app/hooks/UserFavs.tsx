import { useState, useEffect } from "react";

// Define types for favorites
interface Favorite {
  symbol: string;
  companyName: string;
}

export const useUserFavorites = (userEmail: string | undefined) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user favorites from Firebase
  const getUserFavorites = async () => {
    if (!userEmail) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/query-user-favs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          action: "get",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching favorites: ${response.statusText}`);
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  // Add a stock to favorites
  const addFavorite = async (symbol: string, companyName: string) => {
    if (!userEmail) return;

    try {
      const response = await fetch("/api/query-user-favs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          action: "add",
          favorite: { symbol, companyName },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error adding favorite: ${response.statusText}`);
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
      return data;
    } catch (err) {
      console.error("Error adding favorite:", err);
      setError("Failed to add favorite");
      throw err;
    }
  };

  // Remove a stock from favorites
  const removeFavorite = async (symbol: string) => {
    if (!userEmail) return;

    try {
      const response = await fetch("/api/query-user-favs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          action: "remove",
          symbol,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error removing favorite: ${response.statusText}`);
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
      return data;
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError("Failed to remove favorite");
      throw err;
    }
  };

  // Check if a stock is favorited
  const isFavorite = (symbol: string): boolean => {
    return favorites.some((fav) => fav.symbol === symbol);
  };

  // Load favorites on component mount or when email changes
  useEffect(() => {
    if (userEmail) {
      getUserFavorites();
    }
  }, [userEmail]);

  return {
    favorites,
    loading: loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    refreshFavorites: getUserFavorites,
  };
};
