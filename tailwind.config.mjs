// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Define your new color palette here
        'dark-void': '#1A0033', // A deep, almost black purple
        'midnight-black': '#0A001A', // Even deeper, near black
        'primary-green': '#32CD32', // LimeGreen - very vibrant and grassy
        'secondary-green': '#00B06B', // A slightly darker, richer green for variations
        // Optional: You might keep some original colors if still used elsewhere,
        // or rename them to fit the new theme if they are adjusted.
        // 'orange-gradient': '#FF5733', // Example: old orange reference
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};