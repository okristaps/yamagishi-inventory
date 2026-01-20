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
      }
    },
  },
  plugins: [],
};
