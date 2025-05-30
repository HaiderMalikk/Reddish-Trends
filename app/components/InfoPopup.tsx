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

const InfoPopup = ({
  children,
  isOpen,
  onClose,
  title = "Information",
}: InfoPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Animate popup opening
      gsap.set(backdropRef.current, { display: "block" });
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );

      gsap.fromTo(
        popupRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: -20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        },
      );
    } else if (popupRef.current && backdropRef.current) {
      // Animate popup closing
      gsap.to(popupRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
      });

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(backdropRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  // Handle the close action with explicit function
  const handleClose = (e: React.MouseEvent) => {
    // Stop propagation to prevent backdrop click from triggering twice
    e.stopPropagation();
    onClose();
  };

  if (!isOpen && !popupRef.current) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pt-14"
      onClick={onClose}
      style={{ display: "none" }}
    >
      <div
        ref={popupRef}
        className="relative flex max-h-[80vh] w-[90%] max-w-md flex-col rounded-lg bg-customColor2 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header at the top */}
        <div className="sticky top-0 z-10 border-b border-dashed border-black bg-customColor2 p-5 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-customColor4/30">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="pointer-events-none h-4 w-4 text-customColor4"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <p className="text-3xl text-black">{title}</p>
            </div>

            {/* close button  */}
            <button
              onClick={handleClose}
              className="z-20 h-12 w-12 cursor-pointer rounded-full bg-customColor2 text-customColor6 transition-colors hover:bg-gray-200 focus:outline-none"
              aria-label="Close"
              type="button"
            >
              <IoMdClose size={24} className="m-auto" />
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-grow overflow-y-auto p-5 pt-3 text-customColor6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
