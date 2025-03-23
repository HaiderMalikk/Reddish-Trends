import { setCookie } from "cookies-next";

// This endpoint creates a guest session for users who want to use the application
// without creating a full account.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Generate a random unique string for the email
    const randomId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    const tempEmail = `guest_${randomId}_${timestamp}@reddishtrends.temp`;

    // Set cookies to identify the guest user
    setCookie("guestUser", "true", { req, res, maxAge: 60 * 60 * 24 * 7 }); // 7 days
    setCookie("userEmail", tempEmail, { req, res, maxAge: 60 * 60 * 24 * 7 }); // 7 days

    // Return success response with the temporary email
    return res.status(200).json({
      success: true,
      message: "Guest login successful",
      email: tempEmail,
    });
  } catch (error) {
    console.error("Guest login error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
