import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the request parameter from the query string
    const { request } = req.query;
    console.log("Request received from client:", request);

    // Parse the request parameter if it's a string
    // When axios sends params, they get stringified in the URL
    let parsedRequest;
    try {
      parsedRequest =
        typeof request === "string" ? JSON.parse(request) : request;
    } catch (e) {
      console.error("Error parsing request:", e);
      // If we can't parse it, use it as is
      parsedRequest = request;
    }

    console.log("Parsed request:", parsedRequest);
    console.log("Getting response from Flask API, sending request");

    // Make a POST request to the Flask backend with the correct structure
    const response = await fetch(
      process.env.MY_SECRET_FLASK_URL + "/api/home",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Structure the data as expected by the Flask API
        body: JSON.stringify({
          request: parsedRequest, // This is the key change - ensure there's a "request" key
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Flask backend error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Data received from Flask:", data);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error calling Flask backend:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
