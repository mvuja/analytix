/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        mint: "#34d399",
        coral: "#fb7185",
        steel: "#64748b",
      },
      boxShadow: {
        panel: "0 14px 34px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
