import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'K2TAP Garçom',
    short_name: 'K2TAP',
    description: 'Chamadas e solicitações das mesas em tempo real.',
    start_url: '/garcom',
    scope: '/garcom/',
    display: 'standalone',
    background_color: '#06101d',
    theme_color: '#06101d',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
