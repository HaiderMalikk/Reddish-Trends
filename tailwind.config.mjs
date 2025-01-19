export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',  // Important for the App Router
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#3c59a3',
        customWhite: '#f5f5f5',
        customDark: '#01004d', // Deep navy color
      },
      fontFamily: {
        signature: ["var(--font-poppins)", "sans-serif"], // Use your variable here
        secondary: ["italic"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
