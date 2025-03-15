import { useState } from "react";

export const incrementAnalysisRequest = async (
  email: string,
  analysisType: string,
  parameters?: object,
) => {
  if (!email || !analysisType) {
    console.error("Missing user (email) or analysisType");
    return null;
  }

  try {
    const response = await fetch("/api/update-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, // This should be the user's email
        analysisType,
        parameters, // Add parameters for logging
      }),
    });

    if (!response.ok) {
      console.error(
        `Failed to update analytics data: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating analytics data:", error);
    return null;
  }
};

/**
 * Hook to manage analytics requests with debouncing to prevent duplicate calls
 */
export const useAnalyticsTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [recentRequests, setRecentRequests] = useState<Record<string, number>>(
    {},
  );

  const trackAnalysis = async (
    userEmail: string,
    type: string,
    parameters?: object,
  ) => {
    if (!userEmail || isTracking) return null;

    // Add debouncing to prevent multiple quick submissions
    const cacheKey = `${userEmail}-${type}`;
    const currentTime = Date.now();

    // Prevent duplicate requests within 5 seconds
    if (
      recentRequests[cacheKey] &&
      currentTime - recentRequests[cacheKey] < 5000
    ) {
      console.log("Skipping duplicate analytics request");
      return null;
    }

    setIsTracking(true);
    setRecentRequests((prev) => ({ ...prev, [cacheKey]: currentTime }));

    try {
      return await incrementAnalysisRequest(userEmail, type, parameters);
    } finally {
      setIsTracking(false);
    }
  };

  const trackGeneralAnalysis = async (userEmail: string) => {
    return trackAnalysis(userEmail, "general_analysis");
  };

  const trackRedoGeneralAnalysis = async (userEmail: string) => {
    return trackAnalysis(userEmail, "redo_general_analysis");
  };

  // Add playground analysis tracking
  const trackPlaygroundAnalysis = async (
    userEmail: string,
    parameters: object,
  ) => {
    return trackAnalysis(userEmail, "playground_analysis", parameters);
  };

  return {
    trackGeneralAnalysis,
    trackRedoGeneralAnalysis,
    trackPlaygroundAnalysis,
    isTracking,
  };
};
