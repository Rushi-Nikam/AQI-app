/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
    darkMode: 'class', // or 'media'

  theme: {
    extend: {
      // Custom colors, fonts, etc., can be added here if needed
    },
  },
  plugins: [],
}
