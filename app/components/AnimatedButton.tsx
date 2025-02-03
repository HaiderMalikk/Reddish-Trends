import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import "../styles/buttonstyles.css";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  paddinginput?: string;
}

export default function AnimatedButton({ children, onClick, paddinginput }: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const polylineRef = useRef<SVGPolylineElement | null>(null);

  useEffect(() => {
    if (!buttonRef.current || !svgRef.current || !polylineRef.current) return;

    const svg = svgRef.current;
    const wibble = polylineRef.current;
    const width = 100;
    const pointz = 30;
    const spacing = width / pointz;

    let pointzArray = [];
    for (let i = 0; i < pointz; i++) {
      const point = wibble.points.appendItem(svg.createSVGPoint());
      point.x = i * spacing;
      point.y = 25;
      pointzArray.push(point);
    }

    let isAnimating = false;

    const handleMouseEnter = () => {
      if (isAnimating) return;

      isAnimating = true;

      pointzArray.forEach((point, index) => {
        const mapper = gsap.utils.mapRange(0, pointz, 0, 0.4);

        gsap.to(point, {
          keyframes: [
            { y: "+=6", ease: "Sine.easeInOut" },
            { y: "-=12", ease: "Sine.easeInOut" },
            { y: "+=6", ease: "Sine.easeInOut" }
          ],
          yoyo: true,
          duration: 0.6,
          onComplete: () => {
            isAnimating = false;
          }
        }).progress(mapper(index));
      });
    };

    const handleMouseLeave = () => {
      // Reset any animations when mouse leaves (if needed)
    };

    const button = buttonRef.current;
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
      className={`relative ${paddinginput} bg-transparent text-white font-bold rounded-lg transition-all`}
      style={{
        position: "relative",
        overflow: "visible",
        border: "none",
        backgroundColor: "transparent", // Ensure no background
        boxShadow: "none", // No shadow
      }}
    >
      <span
        style={{
          position: "absolute",
          zIndex: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Center the text on top of the button
        }}
      >
        {children}
      </span>
      <svg
        ref={svgRef}
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "15%",
          width: "75%",
          transform: "translateY(-50%)",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        <polyline
          ref={polylineRef}
          stroke="#D8C4B6"
          fill="none"
          strokeWidth="45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
