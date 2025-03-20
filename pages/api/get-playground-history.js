import admin from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get email from query parameters
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Missing email parameter" });
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

    // Get the first (and only) document from the query
    const userData = userSnapshot.docs[0].data();

    // Check if user has playground analytics
    if (
      !userData.requests ||
      !userData.requests.playground_analysis ||
      !userData.requests.playground_analysis.log
    ) {
      return res.status(200).json({
        message: "No playground history found",
        history: [],
      });
    }

    // Extract playground analysis history
    const playgroundHistory = userData.requests.playground_analysis.log || [];

    // Format the history items for the frontend
    const formattedHistory = playgroundHistory
      .map((item, index) => {
        // Each item should have timestamp and parameters
        if (!item || !item.timestamp || !item.parameters) {
          return null; // Skip invalid entries
        }

        // Convert Firestore timestamp to ISO string
        const timestamp = item.timestamp.toDate
          ? item.timestamp.toDate().toISOString()
          : new Date(item.timestamp).toISOString();

        return {
          id: `history-${index}`,
          email: email,
          timestamp: timestamp,
          action: "playground_analysis",
          details: {
            analysisType:
              item.parameters.analysisType || "getplaygroundgeneralanalysis",
            subreddits: item.parameters.subreddits || "",
            limit: item.parameters.limit || 10,
            commentLimit: item.parameters.commentLimit || 10,
            sort: item.parameters.sort || "hot",
            period: item.parameters.period || "1mo",
            stocks: item.parameters.stocks || undefined,
          },
        };
      })
      .filter(Boolean); // Remove any null entries

    // Return the formatted history items, most recent first
    return res.status(200).json({
      history: formattedHistory.reverse(),
    });
  } catch (error) {
    console.error("Error fetching playground history:", error);
    return res.status(500).json({
      message: "Error fetching playground history",
      error: error.message,
    });
  }
}
