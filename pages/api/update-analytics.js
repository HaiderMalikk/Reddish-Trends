import admin from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, analysisType } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Missing email parameter" });
    }

    if (
      !analysisType ||
      !["general_analysis", "redo_analysis"].includes(analysisType)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing analysisType parameter" });
    }

    // Query the user document by email instead of ID
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
    const userDoc = userSnapshot.docs[0];
    const userRef = userDoc.ref;
    const userData = userDoc.data();

    // Create current timestamp
    const timestamp = admin.firestore.Timestamp.now();

    // Create update object based on existing data
    let updateData = {};

    if (userData.requests) {
      // Check if the analysis type object exists
      if (
        userData.requests[analysisType] &&
        typeof userData.requests[analysisType] === "object"
      ) {
        // Analysis type object exists, update the counter and log array
        const currentCount = userData.requests[analysisType].count || 0;
        const currentLog = userData.requests[analysisType].log || [];

        updateData = {
          requests: {
            ...userData.requests,
            [analysisType]: {
              count: currentCount + 1,
              log: [...currentLog, timestamp],
            },
          },
        };
      } else {
        // Analysis type object doesn't exist but requests object does
        updateData = {
          requests: {
            ...userData.requests,
            [analysisType]: {
              count: 1,
              log: [timestamp],
            },
          },
        };
      }
    } else {
      // Requests object doesn't exist, create it with the analysis type object
      updateData = {
        requests: {
          [analysisType]: {
            count: 1,
            log: [timestamp],
          },
        },
      };
    }

    // Update the document
    await userRef.update(updateData);

    res.status(200).json({
      message: "Analytics updated successfully",
      updatedType: analysisType,
      newCount: updateData.requests[analysisType].count,
    });
  } catch (error) {
    console.error("Error updating analytics:", error);
    res
      .status(500)
      .json({ message: "Error updating analytics", error: error.message });
  }
}
