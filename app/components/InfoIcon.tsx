import React from "react";

interface InfoIconProps {
  tooltipText?: string;
  buttonText?: string;
  isPremiumFeature?: boolean;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  tooltipText = "This is a tooltip with detailed information and custom styling.",
}) => {
  return (
    <>
      <div className="group relative inline-block">
        <button className="relative overflow-hidden rounded-xl bg-indigo-600/90 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl transition-opacity group-hover:opacity-75"></div>

          <span className="relative flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </span>
        </button>

        <div className="invisible absolute bottom-full left-1/2 mb-3 w-72 -translate-x-1/2 translate-y-2 transform opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-4 shadow-[0_0_30px_rgba(79,70,229,0.15)] backdrop-blur-md">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-indigo-400"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Important Information
              </h3>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-300">{tooltipText}</p>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 blur-xl"></div>

            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-800/95"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoIcon;
