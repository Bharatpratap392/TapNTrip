// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        'heading': ['"Playfair Display"', 'serif'], // Font for headings
        'body': ['Cinzel', 'serif'], // Font for all other text
      }
    },
  },
  plugins: [],
}