/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        text: "var(--text)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        secondary: "var(--secondary)",
        border: "var(--border)",
        shadow: "var(--shadow)",
        surface: "var(--surface)",
        accent: "var(--accent)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px var(--shadow)",
        cta: "0 4px 14px var(--shadow), 0 2px 4px rgba(13, 148, 136, 0.1)",
        ctaHover: "0 8px 25px var(--shadow), 0 4px 12px rgba(13, 148, 136, 0.2), 0 0 0 3px rgba(13, 148, 136, 0.1)",
        ctaActive: "0 2px 8px var(--shadow)",
        stats: "0 4px 12px var(--shadow)",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        stats: "8px",
      },
      spacing: {
        15: "3.75rem",
      },
      transitionProperty: {
        all: "all",
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};