/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#EAF3FA',
          DEFAULT: '#123B5D',
          dark: '#0B2D49',
        },
        secondary: {
          light: '#E7F7F3',
          DEFAULT: '#0F9D8A',
          dark: '#0B7265',
        },
        accent: {
          light: '#FFF7E6',
          DEFAULT: '#F59E0B',
        },
        success: {
          light: '#ECFDF3',
          DEFAULT: '#16A34A',
        },
        warning: {
          light: '#FFF7ED',
          DEFAULT: '#D97706',
        },
        danger: {
          light: '#FEF2F2',
          DEFAULT: '#DC2626',
        },
        info: {
          light: '#EFF6FF',
          DEFAULT: '#2563EB',
        },
        refund: {
          light: '#F5F3FF',
          DEFAULT: '#7C3AED',
        },
        background: '#F6F8FB',
        surface: '#FFFFFF',
        border: '#DCE3EA',
        muted: '#CBD5E1',
        text: {
          main: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
        },
        gray: {
          50: '#F6F8FB',
          100: '#EEF2F6',
          200: '#E5EBF2',
          300: '#DCE3EA',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#1E293B',
          900: '#0F172A',
        },
        black: '#0F172A',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)',
        medium: '0 14px 32px rgba(15, 23, 42, 0.10)',
        elevated: '0 20px 48px rgba(15, 23, 42, 0.14)',
      },
    },
  },
  plugins: [],
}
