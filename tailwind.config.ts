import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mh-bg': 'var(--mh-bg)',
        'mh-text-dim': 'var(--mh-text-dim)',
        'mh-text-main': 'var(--mh-text-main)',
        'mh-text-bright': 'var(--mh-text-bright)',
        'mh-accent-blue': 'var(--mh-accent-blue)',
        'mh-profit-green': 'var(--mh-profit-green)',
        'mh-loss-red': 'var(--mh-loss-red)',
        'mh-border': 'var(--mh-border)',
        'mh-news': 'var(--mh-news)',
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
