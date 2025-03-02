/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "main-padding": "100px",
      },
      boxShadow: {
        productCard: "0 0 10px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
