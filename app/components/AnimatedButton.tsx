/* 
Component for the animated button 
*/
import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function AnimatedButton({ children, onClick }: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    // GSAP animation on hover
    gsap.fromTo(
      buttonRef.current,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.2,
        paused: true,
        ease: "power1.out",
      }
    );

    // Hover animation using event listeners
    const button = buttonRef.current;
    const handleMouseEnter = () => gsap.to(button, { scale: 1.1, duration: 0.2 });
    const handleMouseLeave = () => gsap.to(button, { scale: 1, duration: 0.2 });

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="px-6 py-3 bg-customColor3 text-white font-bold rounded-lg shadow-md transition-all hover:scale-105"
    >
      {children}
    </button>
  );
}
