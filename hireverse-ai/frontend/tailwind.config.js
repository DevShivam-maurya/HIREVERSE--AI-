/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F1A',
        surface: '#10162A',
        surface2: '#171F38',
        accent: '#6C5CE7',
        accent2: '#00D9C0',
        warn: '#F5A623',
        danger: '#FF5C5C'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px rgba(108, 92, 231, 0.35)'
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
