/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Tema relacionado a comida
        'food-orange': '#FF8C42',
        'food-yellow': '#FFD23F',
        'food-warm': '#F4A261',
        'food-earth': '#E76F51',
        'food-green': '#2A9D8F',
        'food-light': '#FFF8E7',
        'food-dark': '#264653',
      },
    },
  },
  plugins: [],
}

