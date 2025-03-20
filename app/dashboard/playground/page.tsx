"use client";
import React, { useState, useEffect, useCallback } from "react";
import "../styles/playground-styles.css";
import axios from "axios";
import useUserData from "../../hooks/GetUserData";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAnalyticsTracking } from "../../hooks/PostUserAnalytics";
import InfoPopup from "../../components/InfoPopup"; // Import InfoPopup component
import StockCard from "../../components/StockCard"; // Import InfoPopup component
import { FaInfoCircle, FaStar, FaRegStar } from "react-icons/fa"; // Import icons
import { useUserFavorites } from "../../hooks/UserFavs"; // Import favorites hook
import Toast from "../../components/Toast"; // Import the toast component
import RunButton from "../../components/RunButton";

// Define interfaces for our request data
interface RequestParameters {
  subreddits: string[];
  limit: number;
  comment_limit: number;
  sort: string;
  period: string;
  time: string; // Add time parameter
  stocks?: string[]; // Make stocks optional
}

interface RequestData {
  request: {
    type: string;
    parameters: RequestParameters;
  };
}

// Define interface for history items
interface HistoryItem {
  id: string;
  email: string;
  timestamp: string;
  action: string;
  details: {
    analysisType: string;
    subreddits: string;
    limit: number;
    commentLimit: number;
    sort: string;
    period: string;
    time: string; // Add time parameter to history details
    stocks?: string;
  };
}

export default function PlaygroundPage() {
  // Get user data and authentication state
  const { userData, loading: userDataLoading } = useUserData();
  const { user } = useUser();
  const router = useRouter();
  const { trackPlaygroundAnalysis, isTracking } = useAnalyticsTracking();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    loading: favsLoading,
  } = useUserFavorites(userData?.email);

  // State for form inputs
  const [analysisType, setAnalysisType] = useState<string>(
    "getplaygroundgeneralanalysis",
  );
  const [subreddits, setSubreddits] = useState<string>(
    "wallstreetbets,stocks,stockmarket",
  );
  // default states for input
  const [stocks, setStocks] = useState<string>("$AAPL,$TSLA");
  const [limit, setLimit] = useState<number>(10);
  const [commentLimit, setCommentLimit] = useState<number>(10);
  const [sort, setSort] = useState<string>("hot");
  const [period, setPeriod] = useState<string>("1mo");
  const [time, setTime] = useState<string>("none"); // Add state for post time

  // State for API response and loading state
  const [results, setResults] = useState<any>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<RequestData | null>(null);
  const [totalProcessingTime, setTotalProcessingTime] = useState<number>(0);

  // History state
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // stopck info state
  const [stockInfoOpen, setStockInfoOpen] = useState(false);

  // Add state to track which posts are expanded
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  // Add state for parameter info popups
  const [paramInfoOpen, setParamInfoOpen] = useState(false);
  const [currentParamInfo, setCurrentParamInfo] = useState({
    title: "",
    description: "",
  });

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

  const [historyButtonTop, setHistoryButtonTop] = useState<number>(5);

  // Effect to adjust history button position when toast is shown/hidden
  useEffect(() => {
    if (toast.show) {
      setHistoryButtonTop(9.25);
    } else {
      setHistoryButtonTop(5);
    }
  }, [toast.show]);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
    // When toast is closed, the button position will be handled by the useEffect above
  }, []);

  // Function to show parameter info popup
  const showParamInfo = (title: string, description: string) => {
    setCurrentParamInfo({ title, description });
    setParamInfoOpen(true);
  };

  // Function to fetch user's analytics history
  const fetchAnalyticsHistory = useCallback(async () => {
    if (!user || !userData) return;

    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const response = await axios.get("/api/get-playground-history", {
        params: {
          email: userData.email,
        },
      });

      console.log("History items received:", response.data.history); // Debug log
      setHistoryItems(response.data.history || []);
    } catch (err: any) {
      console.error("Error fetching analytics history:", err);
      setHistoryError(err.message || "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }, [user, userData]);

  // Fetch history when history modal is opened
  useEffect(() => {
    if (historyOpen) {
      fetchAnalyticsHistory();
    }
  }, [historyOpen, fetchAnalyticsHistory]);

  // Apply selected history item to form
  const applyHistoryItem = (item: HistoryItem) => {
    const { details } = item;

    setAnalysisType(details.analysisType);
    setSubreddits(details.subreddits);
    setLimit(details.limit);
    setCommentLimit(details.commentLimit);
    setSort(details.sort);
    setPeriod(details.period);
    setTime(details.time || "none"); // Add time to apply from history

    if (details.stocks) {
      setStocks(details.stocks);
    }

    setHistoryOpen(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Function to toggle expanded state of posts
  const togglePostExpand = (stockId: string) => {
    setExpandedPosts((prev) => {
      const newState = {
        ...prev,
        [stockId]: !prev[stockId],
      };

      // If we're collapsing the post, scroll back to its section
      if (prev[stockId] && !newState[stockId]) {
        setTimeout(() => {
          const section = document.getElementById(`stock-${stockId}`);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 100); // Small delay to ensure state is updated
      }

      return newState;
    });
  };

  // Function to truncate text
  const truncateText = (text: string, maxWords: number = 50) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  // Function to render stock description with expand/collapse functionality
  const renderStockDescription = (stock: any, stockId: string) => {
    const isExpanded = expandedPosts[stockId] || false;
    const description = stock.description || "";

    if (!description) return null;

    const shouldTruncate = description.split(" ").length > 50;

    return (
      <div id={`stock-${stockId}`} className="mt-2">
        <p className="text-black">
          {shouldTruncate && !isExpanded
            ? truncateText(description)
            : description}
        </p>

        {shouldTruncate && (
          <button
            onClick={() => togglePostExpand(stockId)}
            className="mt-2 text-sm font-semibold text-blue-800 hover:underline"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  // Custom StockCard with favorites functionality
  const renderStockCard = (stock: any) => {
    return (
      <div className="relative">
        {/* Add favorite button positioned top-left */}
        <button
          className="absolute left-2 top-2 z-10 text-yellow-500 transition-colors hover:text-yellow-300"
          onClick={(e) => {
            e.stopPropagation(); // Prevent any parent click handlers
            if (stock.symbol) {
              handleFavoriteToggle(stock);
            }
          }}
          disabled={favsLoading}
        >
          {isFavorite(stock.symbol) ? (
            <FaStar size={24} />
          ) : (
            <FaRegStar size={24} />
          )}
        </button>
        <StockCard stock={stock} />
      </div>
    );
  };

  // Calculate estimated processing time based on request parameters
  const calculateProcessingTime = (requestData: RequestData): number => {
    const { parameters } = requestData.request;
    const subreddits = parameters.subreddits.length;
    const posts = parameters.limit;
    const comments = parameters.comment_limit;

    // Each subreddit takes constant time of 5 sec
    // Each post takes 1 second
    // Each 10 comments takes 1 second
    const postTime = posts * 0.5;
    const commentTime = Math.ceil(comments / 15) * 1;

    // Calculate total time 5 is for subreddits, plus 5 fro err
    const totalTime = 3 * (postTime + commentTime) + 5;

    console.log(`Estimated processing time: ${totalTime} seconds`);
    return totalTime;
  };

  // Function to update progress based on estimated processing time
  const startProgressUpdates = (processingTime: number) => {
    // Start at 5% to show immediate feedback
    setProgress(5);

    // Calculate how often to update (aim for about 20 updates during the process)
    const updateInterval = Math.max(processingTime / 20, 0.5); // At least every half second
    const progressIncrement = 90 / (processingTime / updateInterval); // 90% of the bar (leave 5% at start and end)

    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += progressIncrement;

      if (currentProgress >= 95) {
        clearInterval(interval);
        setProgress(95); // Cap at 95% until we get the response
      } else {
        setProgress(currentProgress);
      }
    }, updateInterval * 1000);

    return interval;
  };

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setIsApiLoading(true);
    setProgress(5); // Start at 5%

    try {
      // Build request object with proper typing
      const requestData: RequestData = {
        request: {
          type: analysisType,
          parameters: {
            subreddits: subreddits.split(",").map((s) => s.trim()),
            limit: limit,
            comment_limit: commentLimit,
            sort: sort,
            time: time, // Add time parameter to request
            period: period,
          },
        },
      };

      // Add stocks parameter only for specific analysis
      if (analysisType === "getplaygroundspecificanalysis") {
        requestData.request.parameters.stocks = stocks
          .split(",")
          .map((s) => s.trim());
      }

      // Save this request for potential retry
      setLastRequest(requestData);

      // Calculate expected processing time and start progress updates
      const processingTime = calculateProcessingTime(requestData);
      setTotalProcessingTime(processingTime);
      const progressInterval = startProgressUpdates(processingTime);

      console.log("Sending request:", requestData);

      // Send request to our API endpoint
      const response = await axios.post(
        "/api/playground-analysis",
        requestData,
      );

      console.log("Received response:", response.data);
      setResults(response.data);
      setProgress(100);
      clearInterval(progressInterval);

      // Only track analytics after successful API response
      if (user && userData) {
        // Create parameters object to log with the analytics
        const trackingParams = {
          analysisType: analysisType,
          subreddits: subreddits,
          limit: limit,
          commentLimit: commentLimit,
          sort: sort,
          period: period,
          time: time, // Add time parameter to tracking
          stocks:
            analysisType === "getplaygroundspecificanalysis"
              ? stocks
              : undefined,
        };

        await trackPlaygroundAnalysis(userData.email, trackingParams);
      }
    } catch (err: any) {
      console.error("Error submitting playground request:", err);
      setApiError(
        err.message || "An error occurred while processing your request",
      );
      setError(
        err.message || "An error occurred while processing your request",
      );
    } finally {
      setFormLoading(false);
      setIsApiLoading(false);
    }
  };

  // Function to retry the last request if it failed
  const handleRetry = async () => {
    if (!lastRequest) return;

    setIsApiLoading(true);
    setApiError(null);
    setProgress(5);

    try {
      console.log("Retrying request:", lastRequest);

      // Calculate expected processing time and start progress updates
      const processingTime = calculateProcessingTime(lastRequest);
      setTotalProcessingTime(processingTime);
      const progressInterval = startProgressUpdates(processingTime);

      // Send the same request again
      const response = await axios.post(
        "/api/playground-analysis",
        lastRequest,
      );

      console.log("Received response:", response.data);
      setResults(response.data);
      setProgress(100);
      clearInterval(progressInterval);

      // Only track analytics for retry after successful API response
      if (user && userData && lastRequest) {
        const { type, parameters } = lastRequest.request;

        // Create parameters object for tracking
        const trackingParams = {
          analysisType: type,
          subreddits: parameters.subreddits.join(","),
          limit: parameters.limit,
          commentLimit: parameters.comment_limit,
          sort: parameters.sort,
          period: parameters.period,
          time: parameters.time, // Add time parameter to retry tracking
          stocks: parameters.stocks ? parameters.stocks.join(",") : undefined,
          isRetry: true, // Mark this as a retry attempt
        };

        await trackPlaygroundAnalysis(userData.email, trackingParams);
      }
    } catch (err: any) {
      console.error("Error retrying playground request:", err);
      setApiError(
        err.message || "An error occurred while processing your retry request",
      );
    } finally {
      setIsApiLoading(false);
    }
  };

  // Handle favorite toggle for a stock - Matching dashboard implementation exactly
  const handleFavoriteToggle = async (stock: any) => {
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
        // Dashboard implementation uses stock.company_name directly
        await addFavorite(stock.symbol, stock.company_name || stock.name);
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

  // Effect to clear results when analysis type changes
  useEffect(() => {
    setResults(null);
  }, [
    analysisType,
    subreddits,
    limit,
    commentLimit,
    sort,
    period,
    time,
    stocks,
  ]);

  // Effect to reset time when sort is not 'top' or 'controversial'
  useEffect(() => {
    if (sort !== "top" && sort !== "controversial") {
      setTime("none");
    }
  }, [sort]);

  // If user is not logged in, show a message and redirect
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <h1 className="text-customColor5">
          Please log in to view this page. Redirecting you to the login page...
        </h1>
      </div>
    );
  }

  // Show loading screen while user data is loading
  if (userDataLoading || !userData) {
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
        <h1 className="text-customColor2">Loading...</h1>
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
        <h1 className="text-customColor2">Loading market data...</h1>
        <h1 className="text-customColor2">Please stay on this page.</h1>
        <div className="mt-4 h-1 min-w-[300px] bg-customColor5">
          <div
            className="h-full bg-customColor4 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {totalProcessingTime > 0 && (
          <p className="mt-2 text-sm text-gray-300">
            Estimated time:{" "}
            {Math.ceil(totalProcessingTime * (1 - progress / 100))} seconds
            remaining
          </p>
        )}
      </div>
    );
  }

  // Show error screen if an error occurred
  if (userData.message && userData.message.startsWith("Error")) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black">
        {/* Error message Error, then error then recommendation */}
        <h1 className="text-4xl font-semibold text-red-600">Error</h1>
        {/* error message */}
        <p className="mt-4 text-lg text-customColor2">{userData.message}</p>
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
        <h1 className="text-6xl font-semibold text-red-600">API Error</h1>
        <p className="mt-4 text-lg text-customColor2">{apiError}</p>
        <button
          onClick={handleRetry}
          className="mt-6 rounded-lg bg-customColor2 px-10 py-4 text-xl text-black transition hover:bg-opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="playground-wrapper">
      {/* Toast notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      <div className="playground-content p-6">
        <div
          className="fixed right-4 z-20"
          style={{
            top: `${historyButtonTop}rem`,
            transition: "top 0.3s ease-in-out", // Smooth transition
          }}
        >
          <button
            onClick={() => setHistoryOpen(true)}
            type="button"
            className="flex items-center rounded-lg bg-customColor4 px-4 py-2 text-black shadow-md transition hover:bg-opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            History
          </button>
        </div>
        <div className="mx-auto mb-10 w-full max-w-4xl rounded-lg border-2 border-black bg-customColor4 p-12 text-center text-black shadow-md">
          <h1 className="text-6xl font-semibold">Playground</h1>
          <p className="welcome-msg mt-4 text-xl text-gray-600">
            Welcome, {userData.firstName} {userData.lastName}!
          </p>
          <p className="welcome-msg mt-4 text-lg text-gray-600">
            This is the playground page where you can run analysis on stock
            mentions in Reddit communities or get a general overview of popular
            stocks across multiple subreddits.
          </p>
        </div>

        {/* Form Section - Wider to accommodate content */}
        <div className="mx-auto mb-14 w-full max-w-6xl rounded-lg border-2 border-customColor2 bg-black bg-opacity-70 p-6">
          <h2 className="mb-6 text-center text-xl text-customColor2">
            Analysis Parameters
          </h2>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-customColor2">Analysis Type</label>
              <button
                type="button"
                className="text-customColor2 transition-colors hover:text-gray-300"
                onClick={() =>
                  showParamInfo(
                    "Analysis Type",
                    "Choose between general analysis (finds top/worst/rising stocks across selected subreddits) or specific stock analysis (analyzes specific stocks mentioned in selected subreddits).",
                  )
                }
              >
                <FaInfoCircle size={16} />
              </button>
            </div>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
            >
              <option value="getplaygroundgeneralanalysis">
                General Analysis
              </option>
              <option value="getplaygroundspecificanalysis">
                Specific Stock Analysis
              </option>
            </select>

            <div className="flex items-center justify-between">
              <label className="mt-4 block text-customColor2">
                Subreddits (comma-separated)
              </label>
              <button
                type="button"
                className="text-customColor2 transition-colors hover:text-gray-300"
                onClick={() =>
                  showParamInfo(
                    "Subreddits",
                    "Enter the names of subreddits you want to analyze, separated by commas (e.g., 'wallstreetbets,stocks,stockmarket'). The analysis will search for stock mentions in these communities.",
                  )
                }
              >
                <FaInfoCircle size={16} />
              </button>
            </div>
            <input
              type="text"
              value={subreddits}
              onChange={(e) => setSubreddits(e.target.value)}
              className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
            />

            {analysisType === "getplaygroundspecificanalysis" && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="mt-4 block text-customColor2">
                    Stocks (comma-separated with a '$' at the beginning)
                  </label>
                  <button
                    type="button"
                    className="text-customColor2 transition-colors hover:text-gray-300"
                    onClick={() =>
                      showParamInfo(
                        "Stocks",
                        "Enter the stock symbols you want to analyze, separated by commas (e.g., '$AAPL,$TSLA'). The analysis will focus on mentions of these specific stocks in the selected subreddits.",
                      )
                    }
                  >
                    <FaInfoCircle size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  value={stocks}
                  onChange={(e) => setStocks(e.target.value)}
                  className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 mt-4 block text-customColor2">
                    Post Limit
                  </label>
                  <button
                    type="button"
                    className="text-customColor2 transition-colors hover:text-gray-300"
                    onClick={() =>
                      showParamInfo(
                        "Post Limit",
                        "The maximum number of posts to analyze from each subreddit. Higher limits provide more data but increase processing time. If you cannot find a specific stock try incresing this limit",
                      )
                    }
                  >
                    <FaInfoCircle size={16} />
                  </button>
                </div>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 mt-4 block text-customColor2">
                    Comment Limit
                  </label>
                  <button
                    type="button"
                    className="hover:text-3 text-customColor2 transition-colors"
                    onClick={() =>
                      showParamInfo(
                        "Comment Limit",
                        "The maximum number of comments to analyze for each post. Higher limits provide more data but increase processing time. If you cannot find a specific stock try incresing this limit",
                      )
                    }
                  >
                    <FaInfoCircle size={16} />
                  </button>
                </div>
                <input
                  type="number"
                  value={commentLimit}
                  onChange={(e) => setCommentLimit(parseInt(e.target.value))}
                  className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2">
              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 mt-4 block text-customColor2">
                    Sort
                  </label>
                  <button
                    type="button"
                    className="text-customColor2 transition-colors hover:text-gray-300"
                    onClick={() =>
                      showParamInfo(
                        "Sort",
                        "The sorting method for posts: 'Hot' shows currently trending posts, 'New' shows the most recent posts, and 'Top' shows the most popular posts in the selected time period. 'Controversial' shows posts with the most upvotes and downvotes, 'Rising' shows posts that are gaining popularity",
                      )
                    }
                  >
                    <FaInfoCircle size={16} />
                  </button>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
                >
                  <option value="hot">Hot</option>
                  <option value="new">New</option>
                  <option value="top">Top</option>
                  <option value="controversial">Controversial</option>
                  <option value="rising">Rising</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 mt-4 block text-customColor2">
                    Stock Period
                  </label>
                  <button
                    type="button"
                    className="text-customColor2 transition-colors hover:text-gray-300"
                    onClick={() =>
                      showParamInfo(
                        "Period",
                        "The stock time period to analyze. This determines the range of the stock data for example 5d will show the stock data from the last 5 days. for a good rsi choose 1mo and above",
                      )
                    }
                  >
                    <FaInfoCircle size={16} />
                  </button>
                </div>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
                >
                  {/* valid option: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max */}
                  <option value="1d">1 Day</option>
                  <option value="5d">5 Days</option>
                  <option value="1mo">1 Month</option>
                  <option value="3mo">3 Months</option>
                  <option value="6mo">6 Months</option>
                  <option value="1y">1 Year</option>
                  <option value="2y">2 Years</option>
                  <option value="5y">5 Years</option>
                  <option value="10y">10 Years</option>
                  <option value="ytd">Year to Date</option>
                  <option value="max">Max</option>
                </select>
              </div>
            </div>

            {/* Add Post Time option - only show for top or controversial sort */}
            {(sort === "top" || sort === "controversial") && (
              <div className="pb-2">
                <div className="flex items-center justify-between">
                  <label className="mb-2 mt-2 block text-customColor2">
                    Post Time
                  </label>
                  <button
                    type="button"
                    className="text-customColor2 transition-colors hover:text-gray-300"
                    onClick={() =>
                      showParamInfo(
                        "Post Time",
                        "Filter posts by time period. Only applies when 'Sort' is set to 'Top' or 'Controversial'. Defaults to 'None' for no time filtering.",
                      )
                    }
                  >
                    <FaInfoCircle size={16} />
                  </button>
                </div>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-customColor2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-customColor4"
                >
                  <option value="none">None</option>
                  <option value="hour">Past Hour</option>
                  <option value="day">Past 24 Hours</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            )}
            <div className="w-full py-2">
              <RunButton
                text="Run Analysis"
                isLoading={formLoading || isTracking}
                disabled={formLoading || isTracking}
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>

        {/* Results Section - Only show when we have results */}
        {(results || error) && (
          <div className="mx-auto mb-10 mt-8 w-full max-w-6xl">
            <h2 className="mb-6 text-center text-7xl font-bold text-customColor2">
              Analysis Results
            </h2>
            {error && (
              <div className="rounded border border-red-700 bg-red-900 bg-opacity-80 p-4 text-customColor2">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            ;
            {!formLoading && !error && results && (
              <div className="space-y-8">
                {analysisType === "getplaygroundgeneralanalysis"
                  ? // Display general analysis results
                    results.analysis_results.map(
                      (subredditData: any, index: number) => {
                        const subredditName = Object.keys(subredditData)[0];
                        const categories = subredditData[subredditName];

                        return (
                          <div
                            key={index}
                            className="rounded-lg bg-customColor2 p-6 shadow-lg"
                          >
                            <h3 className="mb-4 border-b border-black pb-2 text-2xl font-bold text-black">
                              r/{subredditName}
                            </h3>

                            {/* Top Stocks */}
                            <div className="mb-6">
                              <h4 className="mb-3 text-xl font-semibold text-black">
                                Top Stocks
                              </h4>
                              {categories.top_stocks.length > 0 ? (
                                categories.top_stocks.map(
                                  (stock: any, stockIndex: number) => (
                                    <div key={stockIndex} className="mb-4">
                                      {renderStockCard(stock)}
                                      {renderStockDescription(
                                        stock,
                                        `top-${subredditName}-${stockIndex}`,
                                      )}
                                    </div>
                                  ),
                                )
                              ) : (
                                <p className="italic text-black">
                                  No top stocks found for this subreddit
                                </p>
                              )}
                            </div>

                            {/* Worst Stocks */}
                            <div className="mb-6">
                              <h4 className="mb-3 text-xl font-semibold text-black">
                                Worst Stocks
                              </h4>
                              {categories.worst_stocks.length > 0 ? (
                                categories.worst_stocks.map(
                                  (stock: any, stockIndex: number) => (
                                    <div key={stockIndex} className="mb-4">
                                      {renderStockCard(stock)}
                                      {renderStockDescription(
                                        stock,
                                        `worst-${subredditName}-${stockIndex}`,
                                      )}
                                    </div>
                                  ),
                                )
                              ) : (
                                <p className="italic text-black">
                                  No worst stocks found for this subreddit
                                </p>
                              )}
                            </div>

                            {/* Rising Stocks */}
                            <div className="mb-6">
                              <h4 className="mb-3 text-xl font-semibold text-black">
                                Rising Stocks
                              </h4>
                              {categories.rising_stocks.length > 0 ? (
                                categories.rising_stocks.map(
                                  (stock: any, stockIndex: number) => (
                                    <div key={stockIndex} className="mb-4">
                                      {renderStockCard(stock)}
                                      {renderStockDescription(
                                        stock,
                                        `rising-${subredditName}-${stockIndex}`,
                                      )}
                                    </div>
                                  ),
                                )
                              ) : (
                                <p className="italic text-black">
                                  No rising stocks found for this subreddit
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )
                  : // Display specific stock analysis results
                    results.analysis_results.map(
                      (subredditData: any, index: number) => {
                        const subredditName = Object.keys(subredditData)[0];
                        const stocks =
                          subredditData[subredditName].specific_stock || [];

                        return (
                          <div
                            key={index}
                            className="rounded-lg bg-customColor2 p-6 shadow-lg"
                          >
                            <h3 className="mb-4 border-b border-black pb-2 text-2xl font-bold text-black">
                              r/{subredditName}
                            </h3>

                            {stocks && stocks.length > 0 ? (
                              <div className="space-y-4">
                                {stocks.map(
                                  (stock: any, stockIndex: number) => (
                                    <div key={stockIndex} className="mb-4">
                                      {renderStockCard(stock)}
                                      {renderStockDescription(
                                        stock,
                                        `specific-${subredditName}-${stockIndex}`,
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : (
                              <p className="italic text-black">
                                No stocks found for this subreddit
                              </p>
                            )}
                          </div>
                        );
                      },
                    )}
              </div>
            )}
          </div>
        )}
      </div>

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
            <p>The dollar amount change in price within the selected period.</p>
          </div>
          <div>
            <h4 className="font-bold">Percentage Change</h4>
            <p>The percentage change in price within the selected period</p>
          </div>
          <div>
            <h4 className="font-bold">High</h4>
            <p>
              The highest price the stock reached during the selected period.
            </p>
          </div>
          <div>
            <h4 className="font-bold">Low</h4>
            <p>
              The lowest price the stock reached during the selected period.
            </p>
          </div>
          <div>
            <h4 className="font-bold">RSI (Relative Strength Index)</h4>
            <p>
              A momentum indicator that measures the magnitude of recent price.
              for periods less than 1 month rsi is not reliable.
              <ul className="ml-5 mt-1 list-disc">
                <li>Above 70: Potentially overbought</li>
                <li>Below 30: Potentially oversold</li>
                <li>Between 30-70: Neutral territory</li>
              </ul>
            </p>
          </div>
          <div>
            <h4 className="font-bold">Sentiment Analysis</h4>
            <p>
              A score indicating the overall sentiment from Reddit posts and
              comments.
            </p>
          </div>
        </div>
      </InfoPopup>

      {/* Parameter Info Popup */}
      <InfoPopup
        isOpen={paramInfoOpen}
        onClose={() => setParamInfoOpen(false)}
        title={currentParamInfo.title}
      >
        <p>{currentParamInfo.description}</p>
      </InfoPopup>

      {/* History Popup */}
      <InfoPopup
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Analysis History"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {historyLoading ? (
            <div className="flex justify-center py-8">
              {/* Replace with the same spinner used elsewhere */}
              <div className="spinner-dark">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : historyError ? (
            <div className="rounded border border-red-700 bg-red-900 bg-opacity-50 p-4 text-customColor5">
              <p>{historyError}</p>
            </div>
          ) : historyItems.length === 0 ? (
            <p className="py-4 text-center text-gray-600">
              No history found. Run some analyses to see them here.
            </p>
          ) : (
            <div className="space-y-4">
              {historyItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-lg border border-black bg-customColor4 p-4"
                  onClick={() => applyHistoryItem(item)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {formatDate(item.timestamp)}
                    </span>
                    <span className="rounded-full bg-customColor2 px-2 py-1 text-xs text-black">
                      {item.details.analysisType ===
                      "getplaygroundgeneralanalysis"
                        ? "General"
                        : "Specific"}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-semibold">Subreddits:</span>{" "}
                      {item.details.subreddits}
                    </p>
                    {item.details.stocks && (
                      <p>
                        <span className="font-semibold">Stocks:</span>{" "}
                        {item.details.stocks}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Posts:</span>{" "}
                      {item.details.limit} /{" "}
                      <span className="font-semibold">Comments:</span>{" "}
                      {item.details.commentLimit}
                    </p>
                    <p>
                      <span className="font-semibold">Sort:</span>{" "}
                      {item.details.sort} /{" "}
                      <span className="font-semibold">Period:</span>{" "}
                      {item.details.period}
                    </p>
                    <p>
                      <span className="font-semibold">Post Time:</span>{" "}
                      {item.details.time || "None"}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button className="text-sm text-black hover:text-gray-600">
                      Apply Parameters
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </InfoPopup>
    </div>
  );
}
