import { ReactNode } from "react";
import "./styles/animated-button-styles.css";

interface AnimatedButtonProps {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  paddinginput?: string;
  Buttoncolor?: string;
  fontSize?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  paddinginput,
  Buttoncolor,
  fontSize,
}: AnimatedButtonProps) {
  return (
    <button
      className="button"
      style={{
        verticalAlign: "middle",
        backgroundColor: Buttoncolor || undefined,
        padding: paddinginput ? undefined : "", // Allow CSS classes or direct style override
        fontSize: fontSize || undefined,
      }}
      onClick={onClick}
    >
      <div className={paddinginput || ""}>
        {children || <span>Download</span>}
      </div>
    </button>
  );
}
