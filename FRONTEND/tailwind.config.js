/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#DBEAFE',
          DEFAULT: '#1D4ED8',
          dark: '#1E3A8A',
        },
        danger: {
          light: '#FEE2E2',
          DEFAULT: '#DC2626',
        },
        gray: {
          bg: '#F8FAFC',
          border: '#E2E8F0',
        },
        text: {
          main: '#0F172A',
          muted: '#64748B',
        }
      },
    },
  },
  plugins: [],
}
