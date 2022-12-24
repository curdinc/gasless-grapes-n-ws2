const colors = (await import('tailwindcss/colors')).default

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-albert-sans)"],
      },
      colors: {
        primary: colors.violet,
        neutral: colors.gray,
        accent: colors.cyan,
        success:colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
      },
    },
  },
  plugins: [],
};
