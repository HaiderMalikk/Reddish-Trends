import React, { useEffect, useState } from "react";
import "./styles/refresh-button-styles.css";

interface RefreshButtonProps {
  onClick?: () => void; // yap
}

export default function RefreshButton({
  onClick,
}: RefreshButtonProps): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleClick = () => {
    // If on mobile, scroll to top
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <button className="refresh-button" type="button" onClick={handleClick}>
        <div className="refresh-button__content">
          <span className="refresh-button__text">Refresh</span>
          <span className="refresh-button__est-time">Est time 3 min</span>
        </div>
        <span className="refresh-button__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            viewBox="0 0 48 48"
            height="48"
            className="svg"
          >
            <path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z"></path>
            <path fill="none" d="M0 0h48v48h-48z"></path>
          </svg>
        </span>
      </button>
    </div>
  );
}
