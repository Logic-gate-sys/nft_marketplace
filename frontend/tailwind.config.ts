module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Tell Tailwind to scan your src/ folder for classes
  plugins: [
    require('tailwind-scrollbar-hide'),    // External plugin to hide scrollbars
    function ({ addUtilities }:any) {          // Custom inline plugin
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none"                  // Hide scrollbars in Webkit (Chrome, Safari, Edge)
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",    // Hide scrollbars in IE/Edge (legacy)
          "scrollbar-width": "none",       // Hide scrollbars in Firefox
        },
      }
      addUtilities(newUtilities)           // Register custom classes with Tailwind
    }
  ],
}
