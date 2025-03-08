"use client";
import { ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { IoMdClose } from "react-icons/io";

interface InfoPopupProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const InfoPopup = ({ children, isOpen, onClose, title = "Information" }: InfoPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Animate popup opening
      gsap.set(backdropRef.current, { display: "block" });
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      gsap.fromTo(
        popupRef.current,
        { 
          opacity: 0, 
          scale: 0.8,
          y: -20
        },
        { 
          opacity: 1, 
          scale: 1,
          y: 0,
          duration: 0.4, 
          ease: "back.out(1.7)" 
        }
      );
    } else if (popupRef.current && backdropRef.current) {
      // Animate popup closing
      gsap.to(popupRef.current, { 
        opacity: 0, 
        scale: 0.8,
        y: -20,
        duration: 0.3,
        ease: "power2.in"
      });
      
      gsap.to(backdropRef.current, { 
        opacity: 0, 
        duration: 0.3,
        onComplete: () => {
          gsap.set(backdropRef.current, { display: "none" });
        }
      });
    }
  }, [isOpen]);

  if (!isOpen && !popupRef.current) return null;

  return (
    <div 
      ref={backdropRef} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      style={{ display: "none" }}
    >
      <div 
        ref={popupRef}
        className="relative max-h-[80vh] w-[90%] max-w-md overflow-y-auto rounded-lg bg-customColor2 p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-2">
          <h3 className="text-xl font-bold text-customColor6">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-gray-200"
          >
            <IoMdClose size={24} className="text-customColor6" />
          </button>
        </div>
        <div className="text-customColor6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
