/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0B120D',
          900: '#101812', // Đen xanh
          800: '#163D2B', // Xanh rừng đậm (primary)
          700: '#235339',
          600: '#387A4B', // Xanh lá tự nhiên
          500: '#4E9362',
          400: '#78966A', // Xanh rêu
          300: '#9EBA91',
          200: '#C7DAC0',
          100: '#E4EDE0',
          50: '#F0F6EE',
        },
        ivory: {
          DEFAULT: '#F5F6F0', // Trắng ngà
          soft: '#FAFAF7',
          dark: '#EAEBE3',
          border: '#E1E3D8',
        },
        neutralMuted: '#A5AEA5', // Xám trung tính
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
        heading: ['Manrope', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'forest-sm': '0 2px 8px -2px rgba(16, 24, 18, 0.08)',
        'forest-md': '0 10px 25px -5px rgba(22, 61, 43, 0.12), 0 8px 10px -6px rgba(22, 61, 43, 0.08)',
        'forest-lg': '0 20px 35px -10px rgba(16, 24, 18, 0.18)',
        'forest-glow': '0 0 25px rgba(56, 122, 75, 0.18)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
