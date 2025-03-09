"use client";
import useUserData from "../hooks/GetUserData"; // user data hook
import { useUser } from "@clerk/nextjs"; // Import both useUser for clerk user management
import "./styles/home-page-styles.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import InfoPopup from "../components/InfoPopup"; // Import InfoPopup component
import { FaInfoCircle, FaStar, FaRegStar } from "react-icons/fa"; // Import icons
import { useAnalyticsTracking } from "../hooks/PostUserAnalytics"; // Import analytics tracking
import { useUserFavorites } from "../hooks/UserFavs"; // Import favorites hook
import Toast from "../components/Toast"; // Import the toast component
import axios, { AxiosResponse } from "axios"; // Import axios for API requests

// Define types for the response
interface GPTAnalysis {
  overview: string;
  market_sentiment: string;
  technical_analysis: string;
  fundamental_analysis: string;
  prediction: string;
  "Confidence Score": string;
}

interface StockData {
  symbol: string;
  company_name: string;
  price: string;
  percentage_change: string;
  change: string;
  high: string;
  low: string;
  rsi: string;
  sentiment: number;
  post: string;
  GPT_Analysis: GPTAnalysis;
}

interface FlaskResponse {
  last_updated: string;
  response: {
    Top_Stock: StockData | "None";
    Worst_Stock: StockData | "None";
    Rising_Stock: StockData | "None";
  };
}

export default function Dashboard() {
  const { userData, loading } = useUserData(); // get user data
  const { user } = useUser(); // Use Clerk hook for user management
  const router = useRouter(); // Access the router for navigation
  const [response, setResponse] = useState<FlaskResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // Add state for progress
  const [countdown, setCountdown] = useState<string>(""); // Add state for countdown
  const { trackGeneralAnalysis, trackRedoAnalysis } = useAnalyticsTracking(); // Analytics tracking hooks
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    loading: favsLoading,
  } = useUserFavorites(userData?.email);

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  // Add state for info popups
  const [stockInfoOpen, setStockInfoOpen] = useState(false);
  const [gptInfoOpen, setGptInfoOpen] = useState(false);
  const [stockUpdateInfoOpen, setStockUpdateInfoOpen] = useState(false);

  // Add state to track which posts are expanded
  const [expandedPosts, setExpandedPosts] = useState<{
    top: boolean;
    worst: boolean;
    rising: boolean;
  }>({
    top: false,
    worst: false,
    rising: false,
  });

  // Add functions to scroll to specific sections
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const incrementProgress = () => {
    setProgress((prevProgress) => {
      if (prevProgress >= 95) {
        // if at 90 pause it so it dose reach 100
        return 95;
      }
      return prevProgress + 1;
    });
  };

  // Function to calculate time remaining until midnight EST as update happens at midnight EST
  const calculateTimeUntilMidnightEST = () => {
    const now = new Date();

    // Convert to EST (UTC-5)
    const estOffset = -5 * 60; // EST offset in minutes
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const estMinutes = (utcMinutes + estOffset + 24 * 60) % (24 * 60);

    // Calculate minutes until midnight EST
    const minutesUntilMidnight = 24 * 60 - estMinutes;

    // Convert to hours and minutes
    const hours = Math.floor(minutesUntilMidnight / 60);
    const minutes = minutesUntilMidnight % 60;
    const seconds = 59 - now.getSeconds();

    // Format as HH:MM:SS
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // time since last update
  const parseLastUpdateTime = (lastUpdateTime: string) => {
    // Parse the last update time string
    const [date, time, zone] = lastUpdateTime.split(" ");
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute, second] = time.split(":").map(Number);

    // Create a Date object in the EST timezone
    const estDate = new Date(
      Date.UTC(year, month - 1, day, hour + 4, minute, second),
    );

    // Convert to the user's local time
    return estDate;
  };

  const calculateElapsedTime = (lastUpdateTime: Date) => {
    const now = new Date();
    const elapsed = now.getTime() - lastUpdateTime.getTime();

    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // counter
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    let n = 0;
    if (response && response.last_updated) {
      const lastUpdateTime = parseLastUpdateTime(response.last_updated);
      setElapsedTime(calculateElapsedTime(lastUpdateTime));

      const timer = setInterval(() => {
        setElapsedTime(calculateElapsedTime(lastUpdateTime));
      }, n);
      n = 1000;
      return () => clearInterval(timer);
    }
  }, [response]);

  // Update countdown timer every second
  useEffect(() => {
    let n = 0; // onload display curr time then only once a sec update it
    const timer = setInterval(() => {
      setCountdown(calculateTimeUntilMidnightEST());
    }, n);
    n = 1000;

    return () => clearInterval(timer);
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    handel_flask_call({ type: "redogeneralanalysis" });
  };

  const handel_flask_call = async (request: any) => {
    console.log("Sending data to flask");
    setIsApiLoading(true);
    setApiError(null);
    setProgress(10); // Set initial progress
    const interval = setInterval(incrementProgress, 3000); // Increment progress every 3000ms

    try {
      // Track analytics based on request type
      if (user && userData) {
        if (request.type === "getgeneralanalysis") {
          console.log("Tracking general analysis");
          await trackGeneralAnalysis(userData.email);
        } else if (request.type === "redogeneralanalysis") {
          console.log("Tracking redo general analysis");
          await trackRedoAnalysis(userData.email);
        }
      }
      const response: AxiosResponse<FlaskResponse> = await axios.get(
        "/api/get-stock-data",
        { params: { request: JSON.stringify(request) } },
      );
      console.log("Response from Flask");
      console.log(response.data);
      setResponse(response.data as FlaskResponse);
      setProgress(100); // Set progress to 100 when data is fetched
      if (!response.data) {
        console.error("Error fetching data from Flask response is null");
        setApiError("Failed to load data. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching data from Flask:", error);
      setApiError("Failed to load data. Please try again later.");
    } finally {
      setIsApiLoading(false);
      clearInterval(interval);
    }
  };

  // Function to toggle expanded state of posts
  const togglePostExpand = (type: "top" | "worst" | "rising") => {
    setExpandedPosts((prev) => {
      const newState = {
        ...prev,
        [type]: !prev[type],
      };

      // If we're collapsing the post, scroll back to its section
      if (prev[type] && !newState[type]) {
        setTimeout(() => {
          const section = document.getElementById(`${type}-stock-post`);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 100); // Small delay to ensure state is updated
      }

      return newState;
    });
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // once user make the call
  useEffect(() => {
    if (user) {
      handel_flask_call({ type: "getgeneralanalysis" });
    }
  }, [user, userData]); // Added user dependency to ensure it's available before making the call

  // If user is not logged in, show a message and redirect after 1 second
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <h1 className="text-white">
          Please log in to view this page. Redirecting you to the login page...
        </h1>
      </div>
    );
  }
  // Show loading screen while user data is loading
  if (loading || !userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        {/* Spinner */}
        <div className="spinner m-8">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h1 className="text-white">Loading...</h1>
      </div>
    );
  }

  // Show loading screen while API data is loading
  if (isApiLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black">
        {/* Spinner */}
        <div className="spinner m-8">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h1 className="text-white">Loading market data...</h1>
        <h1 className="text-white">Please stay on this page.</h1>
        <div className="mt-4 h-1 min-w-[300px] bg-gray-200">
          <div
            className="h-full bg-customColor3 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // Show error screen if an error occurred
  if (userData.message.startsWith("Error")) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black">
        {/* Error message Error, then error then recommendation */}
        <h1 className="text-4xl font-semibold text-red-600">Error</h1>
        {/* error message */}
        <p className="mt-4 text-lg text-white">{userData.message}</p>
        {/* recommendation */}
        <p className="mt-4 text-lg text-gray-300">
          Please try refreshing the page or trying again later. If the problem
          persists, please contact us using the contact info at the bottom of
          the page.
        </p>
      </div>
    );
  }

  // Show API error if there was an error fetching data from Flask
  if (apiError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black">
        <h1 className="text-4xl font-semibold text-red-600">API Error</h1>
        <p className="mt-4 text-lg text-white">{apiError}</p>
        <button
          onClick={() => handel_flask_call({ type: "getgeneralanalysis" })}
          className="mt-6 rounded-lg bg-customColor5 px-6 py-2 text-black transition hover:bg-opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handle favorite toggle for a stock
  const handleFavoriteToggle = async (stock: StockData) => {
    try {
      if (isFavorite(stock.symbol)) {
        await removeFavorite(stock.symbol);
        // Show success toast for removing favorite
        setToast({
          show: true,
          message: `${stock.symbol} removed from favorites`,
          type: "success",
        });
      } else {
        await addFavorite(stock.symbol, stock.company_name);
        // Show success toast for adding favorite
        setToast({
          show: true,
          message: `${stock.symbol} added to favorites`,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Show error toast
      setToast({
        show: true,
        message: `Failed to update favorites for ${stock.symbol}`,
        type: "error",
      });
    }
  };

  return (
    // bg div
    <div className="flex min-h-screen flex-col items-center bg-customColor4 p-6">
      {/* Toast notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* welcome message to my 2 person userbase */}
      <div className="mx-auto mb-10 w-full max-w-4xl rounded-lg border-2 border-black bg-customColor4 p-12 text-center text-black shadow-md">
        <h1 className="text-6xl font-semibold">Dashboard</h1>
        <p className="welcome-msg mt-4 text-xl text-gray-600">
          Welcome, {userData.firstName} {userData.lastName}!
        </p>
      </div>

      {response && (
        <div className="mb-10 mt-8 w-full max-w-5xl">
          <h2 className="mb-6 text-center text-7xl font-bold text-customColor2">
            Reddit's Stock's of the Day
          </h2>

          {/* Quick Navigation Buttons */}
          <div className="mb-10 flex justify-center space-x-4">
            <button
              onClick={() => scrollToSection("top-stock")}
              className="rounded-lg bg-customColor2 px-8 py-2 font-bold text-black shadow-md transition hover:bg-opacity-80"
            >
              Top Stock
            </button>
            <button
              onClick={() => scrollToSection("worst-stock")}
              className="rounded-lg bg-customColor2 px-6 py-2 font-bold text-black shadow-md transition hover:bg-opacity-80"
            >
              Worst Stock
            </button>
            <button
              onClick={() => scrollToSection("rising-stock")}
              className="rounded-lg bg-customColor2 px-6 py-2 font-bold text-black shadow-md transition hover:bg-opacity-80"
            >
              Rising Stock
            </button>
          </div>

          {/* Refresh and Countdown Section */}
          <div className="mb-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <button
              onClick={handleRefresh}
              className="flex items-center rounded-lg bg-customColor3 px-10 py-3 font-bold text-white shadow-md transition hover:bg-customColor1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh Stocks of the Day
            </button>
            <div className="time-tracker flex items-center rounded-lg bg-gray-100 px-6 py-3">
              <button
                onClick={() => setStockUpdateInfoOpen(true)}
                className="time-info-button mr-3 text-customColor6 hover:text-gray-500"
              >
                <FaInfoCircle size={18} />
              </button>
              <div className="mr-4 font-medium text-gray-800">
                Stocks update in:
              </div>
              <div className="font-mono font-bold text-red-600">
                {countdown}
              </div>
              <div className="ml-4 mr-4 font-medium text-gray-800">
                Time Since Last Update:
              </div>
              <div className="font-mono font-bold text-red-600">
                {elapsedTime}
              </div>
            </div>
          </div>

          {/* Stock Info Section */}
          <p
            id="top-stock"
            className="mb-6 mt-20 text-center text-5xl font-bold text-customColor2"
          >
            Top Stock
          </p>
          {response.response["Top_Stock"] === "None" ? (
            <div className="rounded-lg bg-customColor2 p-8 text-center shadow-lg">
              <h3 className="text-3xl font-bold text-black">
                Top Stock Not Found!
              </h3>
              <p className="mt-3 text-lg text-gray-700">
                No data available for this category.
              </p>
            </div>
          ) : (
            <>
              <div className="relative rounded-t-lg bg-customColor2 p-8 shadow-lg">
                <button
                  className="absolute right-2 top-2 text-black transition-colors hover:text-gray-600"
                  onClick={() => setStockInfoOpen(true)}
                >
                  <FaInfoCircle size={18} />
                </button>

                {/* Add favorite button */}
                <button
                  className="absolute left-2 top-2 text-yellow-500 transition-colors hover:text-yellow-300"
                  onClick={() =>
                    handleFavoriteToggle(
                      response.response["Top_Stock"] as StockData,
                    )
                  }
                  disabled={favsLoading}
                >
                  {isFavorite(response.response["Top_Stock"].symbol) ? (
                    <FaStar size={24} />
                  ) : (
                    <FaRegStar size={24} />
                  )}
                </button>

                <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex items-center justify-center rounded-full bg-black p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-customColor2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-black">
                      {response.response["Top_Stock"].symbol}{" "}
                      <span className="text-grey-600 text-xl font-normal">
                        ({response.response["Top_Stock"].company_name})
                      </span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-black">
                      ${response.response["Top_Stock"].price}
                    </p>
                    <div className="mt-1 flex items-center justify-end space-x-2">
                      {Number(
                        response.response["Top_Stock"].percentage_change,
                      ) >= 0 ? (
                        <span className="flex items-center text-green-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          <span className="font-medium">
                            {response.response["Top_Stock"].percentage_change}%
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <span className="font-medium">
                            {response.response["Top_Stock"].percentage_change}%
                          </span>
                        </span>
                      )}
                      <span className="text-gray-600">
                        (${response.response["Top_Stock"].change})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6 text-center">
                  <div className="rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">High</p>
                    <p className="text-xl font-semibold text-black">
                      ${response.response["Top_Stock"].high}
                    </p>
                  </div>
                  <div className="rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">Low</p>
                    <p className="text-xl font-semibold text-black">
                      ${response.response["Top_Stock"].low}
                    </p>
                  </div>
                  <div className="rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">RSI</p>
                    <div className="rsi-box items-center text-xl font-semibold text-black">
                      {response.response["Top_Stock"].rsi}
                      {Number(response.response["Top_Stock"].rsi) > 70 && (
                        <div className="rsi-tip ml-1 text-sm text-red-500">
                          (Overbought)
                        </div>
                      )}
                      {Number(response.response["Top_Stock"].rsi) < 30 && (
                        <div className="rsi-tip ml-1 text-sm text-green-500">
                          (Oversold)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sentiment Section */}
                <div className="mt-6 rounded-lg border border-gray-300 p-4">
                  <h4 className="mb-2 text-lg font-semibold text-black">
                    Sentiment Analysis
                  </h4>
                  <div
                    className={`inline-block rounded-full px-4 py-1 text-lg font-medium ${
                      response.response["Top_Stock"].sentiment > 3
                        ? "bg-green-100 text-green-800"
                        : response.response["Top_Stock"].sentiment >= 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {response.response["Top_Stock"].sentiment > 3
                      ? "Positive"
                      : response.response["Top_Stock"].sentiment >= 0
                        ? "Neutral"
                        : "Negative"}
                    ({response.response["Top_Stock"].sentiment}/10)
                  </div>
                </div>

                {/* Reddit Post */}
                <div className="mt-6" id="top-stock-post">
                  <h4 className="mb-2 text-lg font-semibold text-black">
                    Post from Reddit:
                  </h4>
                  <div className="rounded-lg bg-customColor4 bg-opacity-20 p-4">
                    <div className="overflow-hidden break-words text-black">
                      {expandedPosts.top ? (
                        <p className="italic">
                          {response.response["Top_Stock"].post}
                        </p>
                      ) : (
                        <p className="italic">
                          {truncateText(response.response["Top_Stock"].post)}
                        </p>
                      )}

                      {response.response["Top_Stock"].post.length > 150 && (
                        <button
                          onClick={() => togglePostExpand("top")}
                          className="mt-2 text-sm font-semibold text-blue-800 hover:underline"
                        >
                          {expandedPosts.top ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* GPT Analysis Section */}
              <div className="relative rounded-b-lg bg-customColor6 p-8 text-customColor2 shadow-lg">
                <button
                  className="absolute right-2 top-2 text-customColor2 transition-colors hover:text-white"
                  onClick={() => setGptInfoOpen(true)}
                >
                  <FaInfoCircle size={18} />
                </button>

                <div className="mb-4 flex items-center border-b border-customColor2 pb-2">
                  <div className="mr-3 flex items-center justify-center rounded-full bg-customColor2 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-customColor6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">AI Analysis</h3>
                </div>

                <div className="space-y-4 text-customColor2">
                  <div>
                    <h4 className="text-xl font-semibold">Overview</h4>
                    <p className="mt-1">
                      {response.response["Top_Stock"].GPT_Analysis.overview}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">Market Sentiment</h4>
                    <p className="mt-1">
                      {
                        response.response["Top_Stock"].GPT_Analysis
                          .market_sentiment
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">
                      Technical Analysis
                    </h4>
                    <p className="mt-1">
                      {
                        response.response["Top_Stock"].GPT_Analysis
                          .technical_analysis
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">
                      Fundamental Analysis
                    </h4>
                    <p className="mt-1">
                      {
                        response.response["Top_Stock"].GPT_Analysis
                          .fundamental_analysis
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">Prediction</h4>
                    <p className="mt-1">
                      {response.response["Top_Stock"].GPT_Analysis.prediction}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-customColor2 pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold">Confidence Score</h4>
                      <div
                        className={`rounded-full px-4 py-1 text-lg font-bold ${
                          Number(
                            response.response["Top_Stock"].GPT_Analysis[
                              "Confidence Score"
                            ],
                          ) < 30
                            ? "bg-red-700 text-white"
                            : Number(
                                  response.response["Top_Stock"].GPT_Analysis[
                                    "Confidence Score"
                                  ],
                                ) < 70
                              ? "bg-yellow-700 text-white"
                              : "bg-green-700 text-white"
                        }`}
                      >
                        {
                          response.response["Top_Stock"].GPT_Analysis[
                            "Confidence Score"
                          ]
                        }
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Stock Info Section for worst stock */}
          <p
            id="worst-stock"
            className="mb-6 mt-20 text-center text-5xl font-bold text-customColor2"
          >
            Worst Stock
          </p>
          {response.response["Worst_Stock"] === "None" ? (
            <div className="rounded-lg bg-customColor2 p-8 text-center shadow-lg">
              <h3 className="text-3xl font-bold text-black">
                Worst Stock Not Found!
              </h3>
              <p className="mt-3 text-lg text-gray-700">
                No data available for this category.
              </p>
            </div>
          ) : (
            <>
              <div className="relative rounded-t-lg bg-customColor2 p-8 shadow-lg">
                <button
                  className="absolute right-2 top-2 text-black transition-colors hover:text-gray-600"
                  onClick={() => setStockInfoOpen(true)}
                >
                  <FaInfoCircle size={18} />
                </button>

                {/* Add favorite button */}
                <button
                  className="absolute left-2 top-2 text-yellow-500 transition-colors hover:text-yellow-300"
                  onClick={() =>
                    handleFavoriteToggle(
                      response.response["Worst_Stock"] as StockData,
                    )
                  }
                  disabled={favsLoading}
                >
                  {isFavorite(response.response["Worst_Stock"].symbol) ? (
                    <FaStar size={24} />
                  ) : (
                    <FaRegStar size={24} />
                  )}
                </button>

                <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex items-center justify-center rounded-full bg-black p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-customColor2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-black">
                      {response.response["Worst_Stock"].symbol}{" "}
                      <span className="text-grey-600 text-xl font-normal">
                        ({response.response["Worst_Stock"].company_name})
                      </span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-black">
                      ${response.response["Worst_Stock"].price}
                    </p>
                    <div className="mt-1 flex items-center justify-end space-x-2">
                      {Number(
                        response.response["Worst_Stock"].percentage_change,
                      ) >= 0 ? (
                        <span className="flex items-center text-green-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          <span className="font-medium">
                            {response.response["Worst_Stock"].percentage_change}
                            %
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <span className="font-medium">
                            {response.response["Worst_Stock"].percentage_change}
                            %
                          </span>
                        </span>
                      )}
                      <span className="text-gray-600">
                        (${response.response["Worst_Stock"].change})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6 text-center">
                  <div className="rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">High</p>
                    <p className="text-xl font-semibold text-black">
                      ${response.response["Worst_Stock"].high}
                    </p>
                  </div>
                  <div className="rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">Low</p>
                    <p className="text-xl font-semibold text-black">
                      ${response.response["Worst_Stock"].low}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">RSI</p>
                    <div className="items-center text-xl font-semibold text-black">
                      {response.response["Worst_Stock"].rsi}
                      {Number(response.response["Worst_Stock"].rsi) > 70 && (
                        <div className="rsi-tip ml-1 text-sm text-red-500">
                          (Overbought)
                        </div>
                      )}
                      {Number(response.response["Worst_Stock"].rsi) < 30 && (
                        <div className="rsi-tip ml-1 text-sm text-green-500">
                          (Oversold)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sentiment Section */}
                <div className="mt-6 rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-2 text-lg font-semibold text-black">
                    Sentiment Analysis
                  </h4>
                  <div
                    className={`inline-block rounded-full px-4 py-1 text-lg font-medium ${
                      response.response["Worst_Stock"].sentiment > 3
                        ? "bg-green-100 text-green-800"
                        : response.response["Worst_Stock"].sentiment >= 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {response.response["Worst_Stock"].sentiment > 3
                      ? "Positive"
                      : response.response["Worst_Stock"].sentiment >= 0
                        ? "Neutral"
                        : "Negative"}
                    ({response.response["Worst_Stock"].sentiment}/10)
                  </div>
                </div>

                {/* Reddit Post */}
                <div className="mt-6" id="worst-stock-post">
                  <h4 className="mb-2 text-lg font-semibold text-black">
                    Post from Reddit:
                  </h4>
                  <div className="rounded-lg bg-customColor4 bg-opacity-20 p-4">
                    <div className="overflow-hidden break-words text-black">
                      {expandedPosts.worst ? (
                        <p className="italic">
                          {response.response["Worst_Stock"].post}
                        </p>
                      ) : (
                        <p className="italic">
                          {truncateText(response.response["Worst_Stock"].post)}
                        </p>
                      )}

                      {response.response["Worst_Stock"].post.length > 150 && (
                        <button
                          onClick={() => togglePostExpand("worst")}
                          className="mt-2 text-sm font-semibold text-blue-800 hover:underline"
                        >
                          {expandedPosts.worst ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* GPT Analysis Section */}
              <div className="relative rounded-b-lg bg-customColor6 p-8 text-customColor2 shadow-lg">
                <button
                  className="absolute right-2 top-2 text-customColor2 transition-colors hover:text-white"
                  onClick={() => setGptInfoOpen(true)}
                >
                  <FaInfoCircle size={18} />
                </button>

                <div className="mb-4 flex items-center border-b border-customColor2 pb-2">
                  <div className="mr-3 flex items-center justify-center rounded-full bg-customColor2 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-customColor6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">AI Analysis</h3>
                </div>

                <div className="space-y-4 text-customColor2">
                  <div>
                    <h4 className="text-xl font-semibold">Overview</h4>
                    <p className="mt-1">
                      {response.response["Worst_Stock"].GPT_Analysis.overview}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">Market Sentiment</h4>
                    <p className="mt-1">
                      {
                        response.response["Worst_Stock"].GPT_Analysis
                          .market_sentiment
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">
                      Technical Analysis
                    </h4>
                    <p className="mt-1">
                      {
                        response.response["Worst_Stock"].GPT_Analysis
                          .technical_analysis
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">
                      Fundamental Analysis
                    </h4>
                    <p className="mt-1">
                      {
                        response.response["Worst_Stock"].GPT_Analysis
                          .fundamental_analysis
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">Prediction</h4>
                    <p className="mt-1">
                      {response.response["Worst_Stock"].GPT_Analysis.prediction}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-customColor2 pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold">Confidence Score</h4>
                      <div
                        className={`rounded-full px-4 py-1 text-lg font-bold ${
                          Number(
                            response.response["Worst_Stock"].GPT_Analysis[
                              "Confidence Score"
                            ],
                          ) < 30
                            ? "bg-red-700 text-white"
                            : Number(
                                  response.response["Worst_Stock"].GPT_Analysis[
                                    "Confidence Score"
                                  ],
                                ) <= 70
                              ? "bg-yellow-700 text-white"
                              : "bg-green-700 text-white"
                        }`}
                      >
                        {
                          response.response["Worst_Stock"].GPT_Analysis[
                            "Confidence Score"
                          ]
                        }
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ! Stock Info Section for rising stock */}
          <p
            id="rising-stock"
            className="mb-6 mt-20 text-center text-5xl font-bold text-customColor2"
          >
            Rising Stock
          </p>
          {response.response["Rising_Stock"] === "None" ? (
            <div className="rounded-lg bg-customColor2 p-8 text-center shadow-lg">
              <h3 className="text-3xl font-bold text-black">
                Rising Stock Not Found!
              </h3>
              <p className="mt-3 text-lg text-gray-700">
                No data available for this category.
              </p>
            </div>
          ) : (
            <>
              <div className="relative rounded-t-lg bg-customColor2 p-8 shadow-lg">
                <button
                  className="absolute right-2 top-2 text-black transition-colors hover:text-gray-600"
                  onClick={() => setStockInfoOpen(true)}
                >
                  <FaInfoCircle size={18} />
                </button>

                {/* Add favorite button */}
                <button
                  className="absolute left-2 top-2 text-yellow-500 transition-colors hover:text-yellow-300"
                  onClick={() =>
                    handleFavoriteToggle(
                      response.response["Rising_Stock"] as StockData,
                    )
                  }
                  disabled={favsLoading}
                >
                  {isFavorite(response.response["Rising_Stock"].symbol) ? (
                    <FaStar size={24} />
                  ) : (
                    <FaRegStar size={24} />
                  )}
                </button>

                <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex items-center justify-center rounded-full bg-black p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-customColor2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-black">
                      {response.response["Rising_Stock"].symbol}{" "}
                      <span className="text-grey-600 text-xl font-normal">
                        ({response.response["Rising_Stock"].company_name})
                      </span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-black">
                      ${response.response["Rising_Stock"].price}
                    </p>
                    <div className="mt-1 flex items-center justify-end space-x-2">
                      {Number(
                        response.response["Rising_Stock"].percentage_change,
                      ) >= 0 ? (
                        <span className="flex items-center text-green-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          <span className="font-medium">
                            {
                              response.response["Rising_Stock"]
                                .percentage_change
                            }
                            %
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <span className="font-medium">
                            {
                              response.response["Rising_Stock"]
                                .percentage_change
                            }
                            %
                          </span>
                        </span>
                      )}
                      <span className="text-gray-600">
                        (${response.response["Rising_Stock"].change})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6 text-center">
                  <div className="rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">High</p>
                    <p className="text-xl font-semibold text-black">
                      ${response.response["Rising_Stock"].high}
                    </p>
                  </div>
                  <div className="rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">Low</p>
                    <p className="text-xl font-semibold text-black">
                      ${response.response["Rising_Stock"].low}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-customColor4 bg-opacity-30 p-3">
                    <p className="text-sm text-gray-600">RSI</p>
                    <div className="items-center text-xl font-semibold text-black">
                      {response.response["Rising_Stock"].rsi}
                      {Number(response.response["Rising_Stock"].rsi) > 70 && (
                        <div className="rsi-tip ml-1 text-sm text-red-500">
                          (Overbought)
                        </div>
                      )}
                      {Number(response.response["Rising_Stock"].rsi) < 30 && (
                        <div className="rsi-tip ml-1 text-sm text-green-500">
                          (Oversold)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sentiment Section */}
                <div className="mt-6 rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-2 text-lg font-semibold text-black">
                    Sentiment Analysis
                  </h4>
                  <div
                    className={`inline-block rounded-full px-4 py-1 text-lg font-medium ${
                      response.response["Rising_Stock"].sentiment > 3
                        ? "bg-green-100 text-green-800"
                        : response.response["Rising_Stock"].sentiment >= 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {response.response["Rising_Stock"].sentiment > 3
                      ? "Positive"
                      : response.response["Rising_Stock"].sentiment >= 0
                        ? "Neutral"
                        : "Negative"}
                    ({response.response["Rising_Stock"].sentiment}/10)
                  </div>
                </div>

                {/* Reddit Post */}
                <div className="mt-6" id="rising-stock-post">
                  <h4 className="mb-2 text-lg font-semibold text-black">
                    Post from Reddit:
                  </h4>
                  <div className="rounded-lg bg-customColor4 bg-opacity-20 p-4">
                    <div className="overflow-hidden break-words text-black">
                      {expandedPosts.rising ? (
                        <p className="italic">
                          {response.response["Rising_Stock"].post}
                        </p>
                      ) : (
                        <p className="italic">
                          {truncateText(response.response["Rising_Stock"].post)}
                        </p>
                      )}

                      {response.response["Rising_Stock"].post.length > 150 && (
                        <button
                          onClick={() => togglePostExpand("rising")}
                          className="mt-2 text-sm font-semibold text-blue-800 hover:underline"
                        >
                          {expandedPosts.rising ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* GPT Analysis Section */}
              <div className="relative rounded-b-lg bg-customColor6 p-8 text-customColor2 shadow-lg">
                <button
                  className="absolute right-2 top-2 text-customColor2 transition-colors hover:text-white"
                  onClick={() => setGptInfoOpen(true)}
                >
                  <FaInfoCircle size={18} />
                </button>

                <div className="mb-4 flex items-center border-b border-customColor2 pb-2">
                  <div className="mr-3 flex items-center justify-center rounded-full bg-customColor2 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-customColor6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">AI Analysis</h3>
                </div>

                <div className="space-y-4 text-customColor2">
                  <div>
                    <h4 className="text-xl font-semibold">Overview</h4>
                    <p className="mt-1">
                      {response.response["Rising_Stock"].GPT_Analysis.overview}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">Market Sentiment</h4>
                    <p className="mt-1">
                      {
                        response.response["Rising_Stock"].GPT_Analysis
                          .market_sentiment
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">
                      Technical Analysis
                    </h4>
                    <p className="mt-1">
                      {
                        response.response["Rising_Stock"].GPT_Analysis
                          .technical_analysis
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">
                      Fundamental Analysis
                    </h4>
                    <p className="mt-1">
                      {
                        response.response["Rising_Stock"].GPT_Analysis
                          .fundamental_analysis
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">Prediction</h4>
                    <p className="mt-1">
                      {
                        response.response["Rising_Stock"].GPT_Analysis
                          .prediction
                      }
                    </p>
                  </div>

                  <div className="mt-6 border-t border-customColor2 pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold">Confidence Score</h4>
                      <div
                        className={`rounded-full px-4 py-1 text-lg font-bold ${
                          Number(
                            response.response["Rising_Stock"].GPT_Analysis[
                              "Confidence Score"
                            ],
                          ) < 30
                            ? "bg-red-700 text-white"
                            : Number(
                                  response.response["Rising_Stock"]
                                    .GPT_Analysis["Confidence Score"],
                                ) <= 70
                              ? "bg-yellow-700 text-white"
                              : "bg-green-700 text-white"
                        }`}
                      >
                        {
                          response.response["Rising_Stock"].GPT_Analysis[
                            "Confidence Score"
                          ]
                        }
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Stock Info Popup */}
          <InfoPopup
            isOpen={stockInfoOpen}
            onClose={() => setStockInfoOpen(false)}
            title="Stock Information"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Price</h4>
                <p>The current trading price of the stock.</p>
              </div>
              <div>
                <h4 className="font-bold">Change</h4>
                <p>
                  The dollar amount change in price from the previous day's
                  close.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Percentage Change</h4>
                <p>
                  The percentage change in price from the previous day's close.
                </p>
              </div>
              <div>
                <h4 className="font-bold">High</h4>
                <p>
                  The highest price the stock reached during the current trading
                  day.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Low</h4>
                <p>
                  The lowest price the stock reached during the current trading
                  day.
                </p>
              </div>
              <div>
                <h4 className="font-bold">RSI (Relative Strength Index)</h4>
                <p>
                  A momentum indicator that measures the magnitude of recent
                  price changes to evaluate overbought or oversold conditions:
                </p>
                <ul className="ml-5 mt-1 list-disc">
                  <li>
                    Above 70: Potentially overbought (may indicate a coming
                    price decrease)
                  </li>
                  <li>
                    Below 30: Potentially oversold (may indicate a coming price
                    increase)
                  </li>
                  <li>Between 30-70: Neutral territory</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold">Sentiment Analysis</h4>
                <p>
                  A score indicating the overall sentiment from the Reddit post,
                  ranging from -10 (extremely negative) to 10 (extremely
                  positive) and 0 - 3 (neutral).
                </p>
              </div>
              <div>
                <h4 className="font-bold">Post From Reddit</h4>
                <p>
                  The text content of the Reddit post that triggered the
                  analysis.
                </p>
              </div>
              <div>
                <h4 className="font-bold">NOTE</h4>
                <p>
                  For some stocks, some or all of the data may not be available.
                  <li>
                    if the sentiment is 0, it means the sentiment analysis was
                    unavailable or the post was neutral.
                  </li>
                  <li>
                    if the stock data liek price is empty that no info on that
                    stock was found in the API.
                  </li>
                </p>
              </div>
            </div>
          </InfoPopup>

          {/* GPT Analysis Info Popup */}
          <InfoPopup
            isOpen={gptInfoOpen}
            onClose={() => setGptInfoOpen(false)}
            title="GPT Analysis Information"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Overview</h4>
                <p>
                  A general summary of the stock's performance and position in
                  the market.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Market Sentiment</h4>
                <p>
                  Analysis of the overall emotional attitude toward the stock by
                  investors and the market as a whole.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Technical Analysis</h4>
                <p>
                  Evaluation based on price patterns, trading signals, and
                  various technical indicators. This focuses on historical price
                  movement and volume.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Fundamental Analysis</h4>
                <p>
                  Assessment of the company's financial health, business model,
                  and growth potential based on financial statements, market
                  position, and economic factors.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Prediction</h4>
                <p>
                  A forecast of the potential future price movement based on the
                  combined analysis.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Confidence Score</h4>
                <p>
                  A percentage indicating how confident the AI is in its
                  analysis and prediction. Higher scores suggest stronger
                  evidence supporting the prediction.
                </p>
              </div>
            </div>
          </InfoPopup>
          {/* time until */}
          <InfoPopup
            isOpen={stockUpdateInfoOpen}
            onClose={() => setStockUpdateInfoOpen(false)}
            title="Stock Update Information"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Stock Updates</h4>
                <p>
                  The stock of the day is garanteed to be updated at 00:00 EST
                  every day
                </p>
                <p>
                  If any user requests a refresh for the stock of the day, the
                  stock of the day will be updated with those stocks for
                  everyone
                </p>
                <p>
                  If any user logs on and the result is outdated or the time has
                  passed 00:00 EST the analysis will run again but the old
                  result will be shown immediately refresh the page after a
                  minute to get the new result
                </p>
              </div>
            </div>
          </InfoPopup>
        </div>
      )}
    </div>
  );
}
