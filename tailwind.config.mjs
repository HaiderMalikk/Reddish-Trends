import fluid, { extract } from "fluid-tailwind";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    extract,
  ],
  theme: {
    extend: {
      colors: {
        customColor1: "#213555", // ??
        customColor2: "#F5EFE7", // ?? >>>
        customColor3: "#3E5879", // ?? >>
        customColor4: "#D8C4B6", // ?? >
        customColor5: "#f5f5f5", // text
        customColor6: "#000000", // ?? <
      },
      fontFamily: {
        signature: ["var(--font-poppins)", "sans-serif"], // signature font
        secondary: ["italic"], // secondary font
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
    fluid,
  ],
};
