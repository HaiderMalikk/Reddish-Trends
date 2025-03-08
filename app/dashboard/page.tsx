"use client";
import useUserData from "../hooks/GetUserData"; // user data hook
import { useUser } from "@clerk/nextjs"; // Import both useUser for clerk user management
import "./styles/home-page-styles.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import { get_data } from "./get_data";
import InfoPopup from "../components/InfoPopup"; // Import InfoPopup component
import { FaInfoCircle } from "react-icons/fa"; // Import info icon

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
  response: {
    "Top Stock": StockData;
  };
}

export default function Dashboard() {
  const { userData, loading } = useUserData(); // get user data
  const { user } = useUser(); // Use Clerk hook for user management
  const router = useRouter(); // Access the router for navigation
  const [response, setResponse] = useState<FlaskResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  
  // Add state for info popups
  const [stockInfoOpen, setStockInfoOpen] = useState(false);
  const [gptInfoOpen, setGptInfoOpen] = useState(false);

  const handel_flask_call = async (request: any) => {
    console.log("Sending data to flask");
    setIsApiLoading(true);
    setApiError(null);
    
    try {
      const response = await get_data(request);
      console.log("Response from Flask");
      console.log(response);
      setResponse(response as FlaskResponse);
      if (!response){
        console.error("Error fetching data from Flask response is null");
        setApiError("Failed to load data. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching data from Flask:", error);
      setApiError("Failed to load data. Please try again later.");
    } finally {
      setIsApiLoading(false);
    }
  };

  // if we have user make the call even if user if loading or data is loading make the call to flask
  useEffect(() => {
    if (user) {
      handel_flask_call({ type: "getgeneralanalysis" })
    }
  }, []);

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
        <h1 className="text-white">Loading market data...</h1>
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
          className="mt-6 px-6 py-2 bg-customColor5 text-black rounded-lg hover:bg-opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  //  * after user is loaded and no error load other apis no need for checks
  console.log("User Loaded", userData);

  return (
    // bg div
    <div className="flex min-h-screen flex-col items-center bg-customColor4 p-6">

      {/* welcome message to my 2 person userbase */}
      <div className="mx-auto max-w-4xl w-full rounded-lg bg-gradient-to-br from-10%  from-customColor4 to-customColor2 border-black border-2 p-12 text-black shadow-md text-center mb-10">
        <h1 className="text-6xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-xl text-gray-600">
          Welcome, {userData.firstName} {userData.lastName}!
        </p>
      </div>
      
      {response && (
        <div className="mt-8 w-full max-w-5xl mb-10">
          <h2 className="text-5xl font-bold text-center text-customColor2 mb-6">Reddit's Stock of the Day</h2>
          
          {/* Stock Info Section */}
          <div className="bg-customColor2 rounded-t-lg p-8 shadow-lg relative">
            <button 
              className="absolute top-2 right-2 text-black hover:text-gray-600 transition-colors"
              onClick={() => setStockInfoOpen(true)}
            >
              <FaInfoCircle size={18} />
            </button>
            
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <div className="flex items-center">
                <div className="bg-black rounded-full p-2 mr-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-customColor2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-black">
                  {response.response["Top Stock"].symbol} <span className="text-xl font-normal text-grey-600">({response.response["Top Stock"].company_name})</span>
                </h3>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-black">${response.response["Top Stock"].price}</p>
                <div className="flex items-center justify-end space-x-2 mt-1">
                  {Number(response.response["Top Stock"].percentage_change) >= 0 ? (
                    <span className="text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="font-medium">{response.response["Top Stock"].percentage_change}%</span>
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="font-medium">{response.response["Top Stock"].percentage_change}%</span>
                    </span>
                  )}
                  <span className="text-gray-600">(${response.response["Top Stock"].change})</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-6 text-center">
              <div className="bg-customColor4 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-gray-600">High</p>
                <p className="text-xl text-black font-semibold">${response.response["Top Stock"].high}</p>
              </div>
              <div className="bg-customColor4 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-gray-600">Low</p>
                <p className="text-xl text-black font-semibold">${response.response["Top Stock"].low}</p>
              </div>
              <div className="bg-customColor4 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-gray-600">RSI</p>
                <p className="text-xl  text-black font-semibold">
                  {response.response["Top Stock"].rsi}
                  {Number(response.response["Top Stock"].rsi) > 70 && <span className="text-sm text-red-500 ml-1">(Overbought)</span>}
                  {Number(response.response["Top Stock"].rsi) < 30 && <span className="text-sm text-green-500 ml-1">(Oversold)</span>}
                </p>
              </div>
            </div>
            
            {/* Sentiment Section */}
            <div className="mt-6 p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg text-black font-semibold mb-2">Sentiment Analysis</h4>
              <div className={`text-lg font-medium rounded-full px-4 py-1 inline-block ${
                response.response["Top Stock"].sentiment > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}> 
                {response.response["Top Stock"].sentiment > 0 ? "Positive" : "Negative"} 
                ({response.response["Top Stock"].sentiment}/10)
              </div>
            </div>
            
            {/* Reddit Post */}
            <div className="mt-6">
              <h4 className="text-lg text-black font-semibold mb-2">Post from Reddit:</h4>
              <div className="bg-customColor4 bg-opacity-20 p-4 rounded-lg">
                <p className="italic text-black">{response.response["Top Stock"].post}</p>
              </div>
            </div>
          </div>
          
          {/* GPT Analysis Section */}
          <div className="bg-customColor6 text-customColor2 p-8 rounded-b-lg shadow-lg relative">
            <button 
              className="absolute top-2 right-2 text-customColor2 hover:text-white transition-colors"
              onClick={() => setGptInfoOpen(true)}
            >
              <FaInfoCircle size={18} />
            </button>
            
            <div className="flex items-center mb-4 border-b border-customColor2 pb-2">
              <div className="bg-customColor2 rounded-full p-2 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-customColor6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">AI Analysis</h3>
            </div>
            
            <div className="space-y-4 text-customColor2">
              <div>
                <h4 className="font-semibold text-xl">Overview</h4>
                <p className="mt-1">{response.response["Top Stock"].GPT_Analysis.overview}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-xl">Market Sentiment</h4>
                <p className="mt-1">{response.response["Top Stock"].GPT_Analysis.market_sentiment}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-xl">Technical Analysis</h4>
                <p className="mt-1">{response.response["Top Stock"].GPT_Analysis.technical_analysis}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-xl">Fundamental Analysis</h4>
                <p className="mt-1">{response.response["Top Stock"].GPT_Analysis.fundamental_analysis}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-xl">Prediction</h4>
                <p className="mt-1">{response.response["Top Stock"].GPT_Analysis.prediction}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-customColor2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xl">Confidence Score</h4>
                  <div className={`text-lg font-bold rounded-full px-4 py-1 ${
                    Number(response.response["Top Stock"].GPT_Analysis["Confidence Score"]) > 50 
                      ? "bg-green-700 text-white" 
                      : "bg-red-700 text-white"
                  }`}>
                    {response.response["Top Stock"].GPT_Analysis["Confidence Score"]}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stock Info Popup */}
          <InfoPopup isOpen={stockInfoOpen} onClose={() => setStockInfoOpen(false)} title="Stock Information">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Price</h4>
                <p>The current trading price of the stock.</p>
              </div>
              <div>
                <h4 className="font-bold">Change</h4>
                <p>The dollar amount change in price from the previous day's close.</p>
              </div>
              <div>
                <h4 className="font-bold">Percentage Change</h4>
                <p>The percentage change in price from the previous day's close.</p>
              </div>
              <div>
                <h4 className="font-bold">High</h4>
                <p>The highest price the stock reached during the current trading day.</p>
              </div>
              <div>
                <h4 className="font-bold">Low</h4>
                <p>The lowest price the stock reached during the current trading day.</p>
              </div>
              <div>
                <h4 className="font-bold">RSI (Relative Strength Index)</h4>
                <p>A momentum indicator that measures the magnitude of recent price changes to evaluate overbought or oversold conditions:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Above 70: Potentially overbought (may indicate a coming price decrease)</li>
                  <li>Below 30: Potentially oversold (may indicate a coming price increase)</li>
                  <li>Between 30-70: Neutral territory</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold">Sentiment Analysis</h4>
                <p>A score indicating the overall sentiment from the Reddit post, ranging from negative (-10) to positive (10).</p>
              </div>
              <div>
                <h4 className="font-bold">Post From Reddit</h4>
                <p>The text content of the Reddit post that triggered the analysis.</p>
              </div>
            </div>
          </InfoPopup>
          
          {/* GPT Analysis Info Popup */}
          <InfoPopup isOpen={gptInfoOpen} onClose={() => setGptInfoOpen(false)} title="GPT Analysis Information">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Overview</h4>
                <p>A general summary of the stock's performance and position in the market.</p>
              </div>
              <div>
                <h4 className="font-bold">Market Sentiment</h4>
                <p>Analysis of the overall emotional attitude toward the stock by investors and the market as a whole.</p>
              </div>
              <div>
                <h4 className="font-bold">Technical Analysis</h4>
                <p>Evaluation based on price patterns, trading signals, and various technical indicators. This focuses on historical price movement and volume.</p>
              </div>
              <div>
                <h4 className="font-bold">Fundamental Analysis</h4>
                <p>Assessment of the company's financial health, business model, and growth potential based on financial statements, market position, and economic factors.</p>
              </div>
              <div>
                <h4 className="font-bold">Prediction</h4>
                <p>A forecast of the potential future price movement based on the combined analysis.</p>
              </div>
              <div>
                <h4 className="font-bold">Confidence Score</h4>
                <p>A percentage indicating how confident the AI is in its analysis and prediction. Higher scores suggest stronger evidence supporting the prediction.</p>
              </div>
            </div>
          </InfoPopup>
        </div>
      )}
    </div>
  );
}

