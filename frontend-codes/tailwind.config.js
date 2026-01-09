/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // If your code is in a 'src' directory, you must include this:
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      animation: {
        // Define a new animation utility
        'bounce-slow': 'bounce-slow 4s infinite', // 4 seconds duration, repeats infinitely
      },
      keyframes: {
        // Define the keyframes for a gentle up-and-down motion
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }, // Move 10px up at the midpoint
        },
      },
    },
  },
  plugins: [],
}