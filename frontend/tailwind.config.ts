import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1B2B5B',
          gold: '#D4A017',
          cream: '#F8F6F1',
        },
        surface: '#FAFAF8',
        ink: '#1A1A2E',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(27, 43, 91, 0.08)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config
