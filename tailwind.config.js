/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          bg: '#F5EFE4',          // Main background
          cream: '#F5EFE4',
          secondary: '#D2C6A6',   // Secondary background
          sand: '#D2C6A6',
          primary: '#67523C',     // Primary buttons
          hover: '#493725',       // Hover buttons
          espresso: '#493725',
          heading: '#312219',     // Headings
          dark: '#312219',
          body: '#5B5146',        // Body text
          muted: '#5B5146',
          surface: '#FAF7F0',     // Light card surface
          card: '#FFFFFF',
          border: 'rgba(103, 82, 60, 0.15)',
          'border-strong': 'rgba(103, 82, 60, 0.28)',
          accent: '#A86C3E',
          accentGold: '#D4A373',
          success: '#3F6E4D',
          warning: '#B9772B',
          danger: '#98382B'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cafe-sm': '0 2px 8px -2px rgba(49, 34, 25, 0.08), 0 1px 4px -1px rgba(49, 34, 25, 0.04)',
        'cafe': '0 8px 24px -4px rgba(49, 34, 25, 0.10), 0 2px 6px -1px rgba(49, 34, 25, 0.05)',
        'cafe-lg': '0 16px 36px -6px rgba(49, 34, 25, 0.14), 0 6px 12px -2px rgba(49, 34, 25, 0.07)',
        'cafe-inner': 'inset 0 2px 4px 0 rgba(49, 34, 25, 0.06)'
      }
    },
  },
  plugins: [],
};

