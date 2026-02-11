/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    // Enabled themes - stitch is our custom theme, light as fallback
    themes: [
      "stitch",  // Custom Stitch theme (Google Material Design inspired)
      "light",   // DaisyUI default light theme
    ],
    
    // Base element for CSS variables (default: ":root")
    // root: ":root",
    
    // Prefix for daisyUI classes (default: "")
    // prefix: "",
    
    // Enable/disable console logs (default: true)
    logs: true,
    
    // Include/exclude specific components
    // include: [], // Include only specific components
    // exclude: [], // Exclude specific components
  },
}
