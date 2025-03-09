import admin from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, action, favorite, symbol } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Missing email parameter" });
    }

    if (!action || !["get", "add", "remove"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing action parameter" });
    }

    // Query the user document by email
    const userSnapshot = await admin
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      console.error(`User not found with email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Get the first document from the query
    const userDoc = userSnapshot.docs[0];
    const userRef = userDoc.ref;
    const userData = userDoc.data();

    // Handle different actions
    if (action === "get") {
      // Return the current favorites array
      return res.status(200).json({
        favorites: userData.favorites || [],
      });
    } else if (action === "add") {
      // Validate the favorite object
      if (!favorite || !favorite.symbol || !favorite.companyName) {
        return res.status(400).json({ message: "Invalid favorite data" });
      }

      // Check if favorites array exists
      let currentFavorites = userData.favorites || [];

      // Check if stock already exists in favorites
      const existingIndex = currentFavorites.findIndex(
        (fav) => fav.symbol === favorite.symbol,
      );

      if (existingIndex === -1) {
        // Add to favorites if not already present
        currentFavorites.push({
          symbol: favorite.symbol,
          companyName: favorite.companyName,
        });
      }

      // Update the document
      await userRef.update({
        favorites: currentFavorites,
      });

      return res.status(200).json({
        message: "Favorite added successfully",
        favorites: currentFavorites,
      });
    } else if (action === "remove") {
      // Validate symbol parameter
      if (!symbol) {
        return res.status(400).json({ message: "Missing symbol parameter" });
      }

      // Filter out the stock to remove
      let currentFavorites = userData.favorites || [];
      const updatedFavorites = currentFavorites.filter(
        (fav) => fav.symbol !== symbol,
      );

      // Update the document
      await userRef.update({
        favorites: updatedFavorites,
      });

      return res.status(200).json({
        message: "Favorite removed successfully",
        favorites: updatedFavorites,
      });
    }
  } catch (error) {
    console.error("Error processing favorites:", error);
    res
      .status(500)
      .json({ message: "Error processing favorites", error: error.message });
  }
}
