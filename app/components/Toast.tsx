'use client';
import { useEffect } from "react";
import "./styles/toast-styles.css";
// Simple toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);
  
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    return (
      <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-md shadow-xl z-[1000] flex items-center animate-fadeIn`}>
        <span className="text-lg font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold hover:text-gray-200">×</button>
      </div>
    );
  };
  
  export default Toast;