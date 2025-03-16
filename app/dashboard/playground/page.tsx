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
// Define interfaces for our request data
interface RequestParameters {
  subreddits: string[];
  limit: number;
  comment_limit: number;
  sort: string;
  period: string;
  stocks?: string[]; // Make stocks optional
}

interface RequestData {
  request: {
    type: string;
    parameters: RequestParameters;
  };
}

export default function PlaygroundPage() {
  // Get user data and authentication state
  const { userData, loading: userDataLoading } = useUserData();
  const { user } = useUser();
  const router = useRouter();
  const { trackPlaygroundAnalysis, isTracking } = useAnalyticsTracking();

  // State for form inputs
  const [analysisType, setAnalysisType] = useState<string>(
    "getplaygroundgeneralanalysis",
  );
  const [subreddits, setSubreddits] = useState<string>(
    "wallstreetbets,stocks,stockmarket",
  );
  const [stocks, setStocks] = useState<string>("$AAPL,$TSLA");
  const [limit, setLimit] = useState<number>(10);
  const [commentLimit, setCommentLimit] = useState<number>(10);
  const [sort, setSort] = useState<string>("hot");
  const [period, setPeriod] = useState<string>("1mo");

  // State for API response and loading state
  const [results, setResults] = useState<any>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<RequestData | null>(null);
  const [totalProcessingTime, setTotalProcessingTime] = useState<number>(0);

  // stopck info state
  const [stockInfoOpen, setStockInfoOpen] = useState(false);

  // Add state to track which posts are expanded
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

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

  // Function to increment progress bar
  const incrementProgress = () => {
    setProgress((prevProgress) => {
      if (prevProgress >= 95) {
        return 95;
      }
      return prevProgress + 1;
    });
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
    const totalTime = 5 * (postTime + commentTime) + 5;

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

  // If user is not logged in, show a message and redirect
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
        {totalProcessingTime > 0 && (
          <p className="mt-2 text-sm text-gray-400">
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
          onClick={handleRetry}
          className="mt-6 rounded-lg bg-customColor2 px-6 py-2 text-black transition hover:bg-opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="playground-wrapper">
      <div className="playground-content">
        <div className="mx-auto mb-10 w-full max-w-4xl rounded-lg border-2 border-white bg-black p-12 text-center text-black shadow-md">
          <h1 className="text-6xl font-semibold text-white">Playground</h1>
          <p className="welcome-msg mt-4 text-xl text-gray-300">
            Customize your stock analysis parameters and explore real-time
            market insights
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          {/* Form Section */}
          <div className="mx-auto w-full max-w-4xl rounded-lg border-2 border-white bg-black bg-opacity-70 p-4">
            <h2 className="mb-4 text-xl text-white">Analysis Parameters</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-white">Analysis Type</label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
                >
                  <option value="getplaygroundgeneralanalysis">
                    General Analysis
                  </option>
                  <option value="getplaygroundspecificanalysis">
                    Specific Stock Analysis
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-white">
                  Subreddits (comma-separated)
                </label>
                <input
                  type="text"
                  value={subreddits}
                  onChange={(e) => setSubreddits(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
                />
              </div>

              {analysisType === "getplaygroundspecificanalysis" && (
                <div>
                  <label className="mb-1 block text-white">
                    Stocks (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={stocks}
                    onChange={(e) => setStocks(e.target.value)}
                    className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-white">Post Limit</label>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-white">Comment Limit</label>
                  <input
                    type="number"
                    value={commentLimit}
                    onChange={(e) => setCommentLimit(parseInt(e.target.value))}
                    className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-white">Sort</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
                  >
                    <option value="hot">Hot</option>
                    <option value="new">New</option>
                    <option value="top">Top</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-white">Period</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
                  >
                    <option value="1d">1 Day</option>
                    <option value="1wk">1 Week</option>
                    <option value="1mo">1 Month</option>
                    <option value="3mo">3 Months</option>
                    <option value="1y">1 Year</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading || isTracking}
                className="w-full rounded bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700"
              >
                {formLoading || isTracking ? "Processing..." : "Run Analysis"}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="mx-auto w-full max-w-4xl rounded-lg border-2 border-white bg-black bg-opacity-70 p-4">
            <h2 className="mb-4 text-xl text-white">Analysis Results</h2>

            {formLoading && (
              <div className="py-8 text-center">
                <p className="text-white">Processing your request...</p>
                <div className="mx-auto mt-4 h-8 w-8 animate-spin rounded-full border-t-2 border-solid border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="rounded border border-red-700 bg-red-900 bg-opacity-50 p-4 text-white">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

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
                            className="rounded-lg bg-customColor2 p-6"
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
                                    <div key={stockIndex}>
                                      <StockCard stock={stock} />
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
                                    <div key={stockIndex}>
                                      <StockCard stock={stock} />
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
                                    <div key={stockIndex}>
                                      <StockCard stock={stock} />
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
                          subredditData[subredditName].specific_stock;

                        return (
                          <div
                            key={index}
                            className="rounded-lg bg-customColor2 p-6"
                          >
                            <h3 className="mb-4 border-b border-black pb-2 text-2xl font-bold text-black">
                              r/{subredditName}
                            </h3>

                            {stocks.length > 0 ? (
                              <div className="space-y-4">
                                {stocks.map(
                                  (stock: any, stockIndex: number) => (
                                    <div key={stockIndex}>
                                      <StockCard stock={stock} />
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

            {!formLoading && !error && !results && (
              <div className="py-8 text-center text-gray-400">
                <p>
                  No analysis results yet. Configure your parameters and run the
                  analysis.
                </p>
              </div>
            )}
          </div>
        </div>
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
            <p>
              The dollar amount change in price from the previous day's close.
            </p>
          </div>
          <div>
            <h4 className="font-bold">Percentage Change</h4>
            <p>The percentage change in price from the previous day's close.</p>
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
              The lowest price the stock reached during the current trading day.
            </p>
          </div>
          <div>
            <h4 className="font-bold">RSI (Relative Strength Index)</h4>
            <p>
              A momentum indicator that measures the magnitude of recent price
              changes:
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
    </div>
  );
}
