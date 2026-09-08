/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F17',
        surface: {
          DEFAULT: '#111827',
          light: '#1F2937',
          dark: '#0B0F17',
          border: '#1E293B'
        },
        moil: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        risk: {
          low: '#10B981',      // Emerald safe
          moderate: '#3B82F6', // Blue advisory
          high: '#F59E0B',     // Amber high
          critical: '#EF4444'  // Red critical
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.35)'
      }
    },
  },
  plugins: [],
}
