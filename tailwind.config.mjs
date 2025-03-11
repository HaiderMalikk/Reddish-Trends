const fluid = require("fluid-tailwind");
const { extract } = fluid;
// signature: border radius = 0.5rem
module.exports = {
  content: {
    files: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
    ],
    extract,
  },
  theme: {
    extend: {
      colors: {
        customColor1: "#213555",
        customColor2: "#F5EFE7",
        customColor3: "#3E5879",
        customColor4: "#D8C4B6",
        customColor5: "#f5f5f5",
        customColor6: "#000000",
      },
      fontFamily: {
        signature: ["var(--font-poppins)", "sans-serif"],
        secondary: ["italic"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("daisyui"),
    fluid,
  ],
};
