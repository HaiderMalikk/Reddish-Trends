import React, { useState } from "react";
import RedditLink from "./RedditLink";
import "./styles/stock-card-styles.css";

interface StockCardProps {
  stock: {
    symbol: string;
    company_name: string;
    price: string;
    high: string;
    low: string;
    change: string;
    percentage_change: string;
    rsi: string;
    sentiment: number;
    post: {
      title: string;
      text: string;
      comments: string[];
      link: string;
    };
  };
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderPostContent = () => {
    if (!stock.post || !stock.post.title) {
      return <p className="italic">No post data available</p>;
    }

    const truncateText = (text: string, maxWords: number = 50) => {
      if (!text) return "";
      const words = text.split(" ");
      return words.length <= maxWords
        ? text
        : words.slice(0, maxWords).join(" ") + "...";
    };

    return (
      <div className="overflow-hidden break-words text-black">
        <h5 className="mb-2 font-bold">{stock.post.title}</h5>

        {isExpanded ? (
          <>
            <p className="mb-4 italic">{stock.post.text}</p>

            {stock.post.comments && stock.post.comments.length > 0 && (
              <div className="mt-4 border-t border-gray-600 pt-3">
                <h6 className="mb-2 font-bold">Top Comments:</h6>
                <ul className="space-y-3">
                  {stock.post.comments.map((comment, index) => (
                    <li key={index} className="border-l-2 border-gray-300 pl-3">
                      {comment}
                    </li>
                  ))}
                  <RedditLink link={stock.post.link} />
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="italic">{truncateText(stock.post.text)}</p>
        )}

        {((stock.post.text && stock.post.text.split(" ").length > 50) ||
          (stock.post.comments && stock.post.comments.length > 0)) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-semibold text-blue-800 hover:underline"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mb-4 rounded-lg bg-customColor4 bg-opacity-20 p-6">
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <div className="flex items-center">
          <h3 className="stock-txt text-2xl font-bold text-black">
            {stock.symbol}{" "}
            <span className="text-grey-600 text-xl font-normal">
              ({stock.company_name})
            </span>
          </h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-black">${stock.price}</p>
          <div className="mt-1 flex items-center justify-end space-x-2">
            {Number(stock.percentage_change) >= 0 ? (
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
                <span className="font-medium">{stock.percentage_change}%</span>
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
                <span className="font-medium">{stock.percentage_change}%</span>
              </span>
            )}
            <span className="text-gray-600">(${stock.change})</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6 text-center">
        <div className="rounded-lg bg-white bg-opacity-30 p-3">
          <p className="text-sm text-gray-600">High</p>
          <p className="text-xl font-semibold text-black">${stock.high}</p>
        </div>
        <div className="rounded-lg bg-white bg-opacity-30 p-3">
          <p className="text-sm text-gray-600">Low</p>
          <p className="text-xl font-semibold text-black">${stock.low}</p>
        </div>
        <div className="rounded-lg bg-white bg-opacity-30 p-3">
          <p className="text-sm text-gray-600">RSI</p>
          <div className="rsi-box items-center text-xl font-semibold text-black">
            {Number(stock.rsi) === 0 ? (
              <span className="rsi-tip text-gray-400">Not Available</span>
            ) : (
              <>
                {stock.rsi}
                {Number(stock.rsi) > 70 && (
                  <div className="rsi-tip ml-1 text-sm text-red-500">
                    (Overbought)
                  </div>
                )}
                {Number(stock.rsi) < 30 && (
                  <div className="rsi-tip ml-1 text-sm text-green-500">
                    (Oversold)
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-300 p-4">
        <h4 className="mb-2 text-lg font-semibold text-black">
          Sentiment Analysis
        </h4>
        <div
          className={`inline-block rounded-full px-4 py-1 text-lg font-medium ${
            stock.sentiment > 3
              ? "bg-green-100 text-green-800"
              : stock.sentiment >= 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {stock.sentiment > 3
            ? "Positive"
            : stock.sentiment >= 0
              ? "Neutral"
              : "Negative"}
          ({stock.sentiment * 10}%)
        </div>
      </div>

      <div className="mt-6">
        <h4 className="mb-2 text-lg font-semibold text-black">
          Post from Reddit:
        </h4>
        <div className="rounded-lg bg-white bg-opacity-20 p-4">
          {renderPostContent()}
        </div>
      </div>
    </div>
  );
};

export default StockCard;
