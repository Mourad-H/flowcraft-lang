/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anime: {
          bg: '#0f172a',      // أزرق ليلي غامق
          card: '#1e293b',    // لون البطاقات
          accent: '#f472b6',  // وردي نيون
          primary: '#38bdf8', // أزرق سماوي
          warning: '#facc15', // أصفر
        }
      },
    },
  },
  plugins: [],
}