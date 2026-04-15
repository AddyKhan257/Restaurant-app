/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#f9d6a5',
          300: '#f5b96d',
          400: '#f09332',
          500: '#ed7a0f',
          600: '#de5f09',
          700: '#b8470a',
          800: '#933810',
          900: '#773010',
          950: '#401606',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3eae2',
          200: '#c7d5c6',
          300: '#a1b89f',
          400: '#789876',
          500: '#587a56',
          600: '#446243',
          700: '#374e37',
          800: '#2e402e',
          900: '#273527',
          950: '#131c13',
        },
        cream: '#faf7f2',
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
