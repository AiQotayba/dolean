
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', ...fontFamily.sans],
        body: ['var(--font-body)', ...fontFamily.sans]
      },
      colors: {
        brand: {
          dark: "#123D3A",       // الأخضر الداكن
          deep: "#123D3A",
          teal: "#206C63",
          orange: "#D58A38",     // البرتقالي الدافئ
          orangeHover: "#BE772B",
          gray: "#A9B5B0",       // الرمادي الناعم
          light: "#F8F8F5",      // أوف الطبيعي
          canvas: "#F8F8F5",
        },
        primary: {
          50: "#F2F6F5",
          100: "#E2ECE9",
          200: "#C5D8D3",
          300: "#98B7B0",
          400: "#5F8F87",
          500: "#206C63",
          600: "#123D3A",
          700: "#0E2F2D",
          800: "#0A2220",
          900: "#061514",
          950: "#030A09",
        },
      },
    },
  },

  plugins: [
    require("tailwindcss-animate")],
};
