/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        light: '#ffffff',
        dark: '#1e1e1e',
      },
      textColor: {
        light: '#333333',
        dark: '#ffffff',
      },
    },
  },
  plugins: [],
}