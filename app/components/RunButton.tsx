import React, { useEffect, useState } from 'react';
import './styles/run-button-styles.css'

interface RunButtonProps {
  text?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  className?: string;
}

const RunButton: React.FC<RunButtonProps> = ({ 
  text = "Send", 
  onClick,
  className = "" 
}) => {
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If on mobile, scroll to top
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <button className={`button ${className}`} type="button" onClick={handleClick}>
        <span className="button__text">{text}</span>
        <span className="button__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default RunButton;
