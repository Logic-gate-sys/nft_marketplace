/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // OpenSea Dark Theme Colors
      colors: {
        // Primary OpenSea Blue
        'opensea-blue': '#2081E2',
        'opensea-blue-dark': '#1868B7',
        'opensea-blue-light': '#3291FF',
        
        // Dark Theme Backgrounds
        'os-bg-primary': '#202225',      // Main background
        'os-bg-secondary': '#2C2F33',    // Cards, modals
        'os-bg-tertiary': '#23262F',     // Sidebar, header
        'os-bg-hover': '#303339',        // Hover states
        'os-bg-elevated': '#363A45',     // Elevated elements
        
        // Text Colors
        'os-text-primary': '#FBFDFF',    // Primary text
        'os-text-secondary': '#8A939B',  // Secondary text
        'os-text-tertiary': '#707A83',   // Disabled/muted text
        'os-text-inverse': '#04111D',    // Text on light bg
        
        // Border Colors
        'os-border': '#353840',          // Default borders
        'os-border-light': '#4C505C',    // Lighter borders
        
        // Accent Colors
        'os-green': '#30C46C',           // Success
        'os-red': '#EB5757',             // Error/Danger
        'os-yellow': '#FBCB4A',          // Warning
        'os-purple': '#8B5CF6',          // Highlight
        
        // Status Colors
        success: '#30C46C',
        error: '#EB5757',
        warning: '#FBCB4A',
        info: '#2081E2',
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
      },
      
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      
      boxShadow: {
        'os-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'os-md': '0 4px 14px 0 rgba(0, 0, 0, 0.4)',
        'os-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.5)',
        'os-card': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
