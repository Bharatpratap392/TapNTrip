// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Section colors (kept the same as previous request)
        'saarthi-header': '#99BC85', // Color for header
        'saarthi-sidebar': '#E4EFE2', // Corrected from E4EFE7 as seen in your last successful render image.
        'saarthi-card-bg': '#FAF1E6', // Color for card backgrounds (Plan Your Trip, Pilgrimage Suggestions)
        'saarthi-main-bg': '#FDFAF6', // Color for main content area background

        // Enhanced Text Colors
        'saarthi-text-primary': '#34495E', // Enhanced: Darker for better contrast and readability
        'saarthi-text-secondary': '#ADB2D4', // Re-purposed previous 'saarthi-dark' for secondary text
        // Button colors and border colors are also adjusted to complement new text color and backgrounds
        'saarthi-button-primary': '#99BC85', // Using header color for primary button for consistency
        'saarthi-button-secondary': '#C7D9DD', // Using a soft blue-grey for secondary button
        'saarthi-border-light': '#D5E5D5', // A general light border color
        'saarthi-input-border': '#C7D9DD', // Input field border color

        // Dark mode colors
        dark: {
          'bg-primary': '#0f1117',
          'bg-secondary': '#1a1e2e',
          'bg-tertiary': '#1e2233',
          'text-primary': '#ffffff',
          'text-secondary': '#94a3b8',
          'border': '#1f2937',
          'hover': '#2d3348'
        }
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['"Playfair Display"', 'serif'], // Font for headings
        'body': ['Cinzel', 'serif'], // Font for all other text
      },
      boxShadow: {
        'soft': '0 2px 4px 0 rgba(0,0,0,0.05)',
        'medium': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'hard': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}