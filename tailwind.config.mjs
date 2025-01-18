export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',  // Important for the App Router
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#1E40AF',
      },
      fontFamily: {
        geist: ['--font-geist-sans'],
        geistMono: ['--font-geist-mono'],
        signature: ["var(--font-signature)", "cursive"], // Ensure fallback
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
