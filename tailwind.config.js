/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1DCD9F',      // Vibrant green
        secondary: '#169976',    // Deep teal
        accent: '#222222',       // Dark gray
        background: '#000000',   // Black
        foreground: '#FFFFFF',   // White for text
      },
    },
  },
  plugins: [],
};
