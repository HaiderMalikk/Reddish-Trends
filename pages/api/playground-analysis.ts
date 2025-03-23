import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the request body
    const requestData = req.body;
    const userEmail = requestData.email;

    // Check if user is a guest and update the email if needed
    if (userEmail?.endsWith(".temp")) {
      requestData.email = "reddishtrendscommunity@gmail.com";
    }

    console.log("Playground request received:", requestData);

    // Make a POST request to the Flask backend
    const response = await fetch("http://127.0.0.1:8080/api/playground", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Flask backend error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Data received from Flask playground API:", data);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error calling Flask playground API:", error);
    return res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
}
