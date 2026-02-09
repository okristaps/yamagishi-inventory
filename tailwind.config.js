module.exports = {
  content: [    
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/konsta/**/*.{js,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        ios: 'var(--font-ios)',
        material: 'var(--font-material)',
      },
      colors: {
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          input: '#2a2a2a',
        }
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(calc(100% + 1rem))' },
          to: { transform: 'translateX(0)' },
        },
        slideOut: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(100% + 1rem))' },
        },
        swipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + 1rem))' },
        },
      },
      animation: {
        slideIn: 'slideIn 200ms ease-out',
        slideOut: 'slideOut 200ms ease-in',
        swipeOut: 'swipeOut 100ms ease-out',
      },
    },
  },
  plugins: [],
};
