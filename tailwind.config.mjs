export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#3c59a3', // signature color (background)
        customWhite: '#f5f5f5', // secondary color (components)
        customDark: '#01004d', // header/footer color
      },
      fontFamily: {
        signature: ["var(--font-poppins)", "sans-serif"], // signature font
        secondary: ["italic"], // secondary font
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
