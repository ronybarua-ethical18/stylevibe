export default {
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
          800: '#4d3ca3',
        },
        paragraph: {
          400: '#eee',
        },
        violet: {
          700: '#7c3aed',
        },
        gray: {
          200: '#e5e7eb',
          400: '#9ca3af',
          600: '#4b5563',
          700: '#374151',
        },
        red: {
          500: '#ef4444',
        },
        black: {
          DEFAULT: '#000000',
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
