import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Market Hustle',
    short_name: 'Market Hustle',
    description: 'Buy low. Sell high. Don\'t go broke.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#0d1117',
    orientation: 'portrait',
    icons: [
      {
        src: '/image.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
