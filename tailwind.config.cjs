/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        heading: ["var(--font-nunito)", ...fontFamily.sans],
      },
      colors: {
        primary: colors.violet,
        neutral: colors.gray,
        accent: colors.cyan,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
