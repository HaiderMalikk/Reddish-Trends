import React, { useEffect, useState } from "react";

interface InfoIconProps {
  tooltipText?: string;
  buttonText?: string;
  title: string;
  x?: number | string; // X coordinate position for desktop
  y?: number | string; // Y coordinate position for desktop
  mobileX?: number | string; // X coordinate position for mobile
  mobileY?: number | string; // Y coordinate position for mobile
  positionType?: "absolute" | "relative" | "fixed"; // Type of positioning
  mobileBreakpoint?: number; // Breakpoint for mobile devices in pixels
}

const InfoIcon: React.FC<InfoIconProps> = ({
  title,
  tooltipText = "This is a tooltip with detailed information and custom styling.",
  x,
  y,
  mobileX,
  mobileY,
  positionType = "relative",
  mobileBreakpoint = 768, // Default mobile breakpoint
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile based on screen width
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Initial check
    checkIsMobile();

    // Add listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [mobileBreakpoint]);

  // Create style object for positioning
  const positionStyle: React.CSSProperties = {
    position: positionType,
    left:
      isMobile && mobileX !== undefined
        ? typeof mobileX === "number"
          ? `${mobileX}px`
          : mobileX
        : x !== undefined
          ? typeof x === "number"
            ? `${x}px`
            : x
          : undefined,
    top:
      isMobile && mobileY !== undefined
        ? typeof mobileY === "number"
          ? `${mobileY}px`
          : mobileY
        : y !== undefined
          ? typeof y === "number"
            ? `${y}px`
            : y
          : undefined,
  };

  return (
    <>
      <div className="group relative mr-4 inline-block" style={positionStyle}>
        <span className="relative flex cursor-pointer items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            stroke="black"
            fill="none"
            className="h-5 w-5 text-black" // Increased from h-4 w-4 to h-5 w-5
          >
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
        </span>

        <div className="invisible absolute bottom-full left-1/2 mb-3 w-72 -translate-x-1/2 translate-y-2 transform opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div className="relative rounded-2xl border border-white/10 bg-black p-4 shadow-[0_0_30px_rgba(216,196,182,0.15)] backdrop-blur-md">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-customColor4/20">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-customColor4"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-customColor5">
                {title}
              </h3>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-customColor5">{tooltipText}</p>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-customColor2/10 to-customColor2/10 opacity-50 blur-xl"></div>

            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-black"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoIcon;
