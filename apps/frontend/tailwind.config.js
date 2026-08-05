module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        customPrimary: {
          50: '#f3f1fb',
          100: '#e5e0f6',
          300: '#a99bea',
          500: '#6a5ac2',
          700: '#5847b0',
          800: '#4d3ca3',
          900: '#3a2d80',
        },
        paragraph: {
          400: '#eee',
        },
      },
      boxShadow: {
        'custom-shadow': 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
        'simple-shadow': 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
        'review-card': 'rgba(0, 0, 0, 0.09) 0px 3px 12px', // Removed the semicolon
      },
      backgroundImage: {
        'hero-pattern': "url('/client.jpg')",
      },
      borderRadius: {
        'review-card': '0% 15% 0% 0% / 0% 15% 0% 0%',
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
      },
    },
  },
  plugins: [],
};
