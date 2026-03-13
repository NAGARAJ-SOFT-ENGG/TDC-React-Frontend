/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/**/*.{html,js,jsx,ts,tsx,cjs}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        sidebarGradient: 'linear-gradient(90deg, #f0f0f0 0%, #ffffff 100%);',
      },
      colors: {
        headerBG: " #5dbccd",
        cta: "#08469D",
        bodyBG: "#ffffff",
        primary: '#f5d000',
        icon:"#08469D",
        textActive:"#288654",
        textInactive:"#6B7280",
        textWarn:"#AA4A44"
      },
      fontFamily: {
         textPrimary: ['"Open Sans"', 'sans-serif'],
        textSecondary: ['"PT Sans Narrow"', 'sans-serif'],
        cta: ['"Cabin"', 'sans-serif'],
        logoText:['"Oswald"', 'sans-serif'],
      },
       animation: {
        'spin-slow': 'spin 5s linear infinite',
      },
    },
  },
  fontFamily: {
    sans: ['Roboto', 'sans-serif'],
  },
  plugins: [],
}

