/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6ff', 100: '#d9ebff', 200: '#bcdcff', 300: '#8ec4ff',
          400: '#599fff', 500: '#3377e6', 600: '#1f57c7', 700: '#1845a1',
          800: '#0F4C81', 900: '#0d3d6b', 950: '#082849',
        },
        secondary: {
          50: '#e6fbfb', 100: '#c2f5f5', 200: '#88eaea', 300: '#4fd9d9',
          400: '#1fc4c4', 500: '#0AA6A6', 600: '#088a8a', 700: '#0a6e6e',
          800: '#0e5757', 900: '#114a4a', 950: '#042e2e',
        },
        accent: {
          50: '#f0fbff', 100: '#e0f5ff', 200: '#baecff', 300: '#7dddff',
          400: '#4FC3F7', 500: '#2aa8e8', 600: '#1a87c9', 700: '#196da2',
          800: '#1b5983', 900: '#1c4b6d', 950: '#0c3149',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        medicalbg: '#F5FAFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'soft': '0 4px 24px -8px rgba(15, 76, 129, 0.12), 0 1px 3px rgba(15, 76, 129, 0.06)',
        'glow': '0 0 40px -10px rgba(10, 166, 166, 0.4)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
