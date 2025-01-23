const { nextui } = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./*",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors (light mode)
        background: "#F8F8F2", // Light Background
        foreground: "#272822", // Light text
        primary: "#895FD1",
        primaryHover: "#9B70E8",
        primaryActive: "#AE81FF",

        // Dark mode colors (using dark prefix)
        darkBg: "#272822", // Dark Background
        darkText: "#F8F8F2", // Dark Text
        darkPrimary: "#AE81FF",
        darkPrimaryHover: "#9B70E8",
        darkPrimaryActive: "#895FD1",
        // ... any other dark mode colors
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui",
      addCommonColors: false,
      defaultTheme: "dark",
      defaultExtendTheme: "dark",
      layout: {
        spacing: {
          1: "4px",
          2: "8px",
          3: "12px",
        },
      },
      themes: {
        dark: {
          layout: {
            bg: "#272822",
            textColor: "#F8F8F2",
          },
          colors: {
            front:"#161A1D",
            background: "#272822",
            foreground: "#F8F8F2",
            primary: "#AE81FF",
            primaryHover: "#9B70E8",
            primaryActive: "#895FD1",
            warning: "#F0A324",
            error: "#F44747",
          },
        },
        light: {
          layout: {
            bg: "#F8F8F2",
            textColor: "#272822",
          },
          colors: {
            front:"#161A1D",
            background: "#F8F8F2",
            foreground: "#272822",
            primary: "#895FD1",
            primaryHover: "#9B70E8",
            primaryActive: "#AE81FF",
            warning: "#F0A324",
            error: "#A00000",
          },
        },
      },
    }),
   
  ],
};
