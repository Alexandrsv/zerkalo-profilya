/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[appearance="dark"]'],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        ss: "400px",
      },
      colors: {
        "txt-secondary": "var(--vkui--color_text_secondary)",
        "txt-negative": "var(--destructive,var(--vkui--color_text_negative))",
        "content-bg":
          "var(--background_content, var(--vkui--color_background_content))",
      },
      keyframes: {
        "hue-rotate": {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(360deg)" },
        },
      },
      animation: {
        "hue-rotate": "hue-rotate 10s infinite linear",
      },
    },
  },
  plugins: [],
};
