/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700', // Gold for QuestChain
        secondary: '#4A90E2', // Blue for UI elements
        accent: '#50C878', // Emerald for highlights
        background: '#1E293B', // Dark blue background
      },
      fontFamily: {
        pixel: ['VT323', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        questchain: {
          primary: '#FFD700',
          secondary: '#4A90E2',
          accent: '#50C878',
          neutral: '#1E293B',
          'base-100': '#0F172A',
          'base-content': '#E2E8F0',
        },
      },
    ],
  },
}
