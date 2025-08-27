/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "glass-tint": "var(--glass-tint)",
        "brand-green": "var(--color-brand-green)",
        "brand-light-gray": "var(--color-brand-light-gray)",
      },
      // You can extend other properties here if needed
    },
  },
  plugins: [],
};
