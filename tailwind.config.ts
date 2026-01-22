import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mh-bg': '#0d1117',
        'mh-text-dim': '#5a6a7a',
        'mh-text-main': '#a0b3c6',
        'mh-text-bright': '#c8d8e8',
        'mh-accent-blue': '#7eb8da',
        'mh-profit-green': '#00ff88',
        'mh-loss-red': '#ff5252',
        'mh-border': '#2a3a4a',
        'mh-news': '#ffaa00',
        'mh-rumor': '#b8860b',
      },
      fontFamily: {
        mono: ['"Courier New"', '"Lucida Console"', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
