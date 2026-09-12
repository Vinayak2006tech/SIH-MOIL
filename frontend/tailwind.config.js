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
        background: '#0F1214',
        surface: {
          DEFAULT: '#161D22',
          card: '#1B2226',
          light: '#222D33',
          dark: '#0F1214',
          border: '#26333B'
        },
        manganese: {
          50: '#F6F4F9',
          100: '#EDE9F3',
          200: '#DBD4E6',
          300: '#BFB2D3',
          400: '#9B8BBF',
          500: '#7E69AB',
          600: '#6B5B95',
          700: '#564879',
          800: '#42375C',
          900: '#2F2742',
          bronze: '#8B6F47'
        },
        moil: {
          50: '#F6F4F9',
          100: '#EDE9F3',
          200: '#DBD4E6',
          300: '#BFB2D3',
          400: '#9B8BBF',
          500: '#7E69AB',
          600: '#6B5B95',
          700: '#564879',
          800: '#42375C',
          900: '#2F2742',
        },
        tech: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#00C2CC',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A'
        },
        risk: {
          low: '#10B981',      // Emerald safe
          moderate: '#2DD4BF', // Electric teal / satellite advisory
          high: '#F59E0B',     // Amber high
          critical: '#DC5F4E'  // Muted red critical shortfall
        }
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(45, 212, 191, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(0, 194, 204, 0.35)',
        'glow-manganese': '0 0 25px -5px rgba(107, 91, 149, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(107, 91, 149, 0.40)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 25px -5px rgba(220, 95, 78, 0.35)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.35)'
      }
    },
  },
  plugins: [],
}
