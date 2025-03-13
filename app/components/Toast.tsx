"use client";
import { useEffect, useState } from "react";
import "./styles/toast-styles.css";
// Simple toast notification component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeOutTime = 300; // Match this with the CSS animation duration
    const totalDisplayTime = 3000;

    const fadeOutTimer = setTimeout(() => {
      setIsFading(true);
    }, totalDisplayTime - fadeOutTime);

    const closeTimer = setTimeout(() => {
      onClose();
    }, totalDisplayTime);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed right-4 top-20 ${bgColor} ${isFading ? "animate-fadeOut" : "animate-fadeIn"} z-[1000] flex items-center rounded-lg px-6 py-3 text-customColor2 shadow-xl`}
    >
      <span className="text-lg font-medium">{message}</span>
      <button
        onClick={() => {
          setIsFading(true);
          setTimeout(onClose, 300);
        }}
        className="ml-4 text-xl font-bold hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
