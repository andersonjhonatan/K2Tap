import type { Metadata, ReactNode } from 'next'

export const metadata: Metadata = {
  title: 'K2TAP Garçom',
  description: 'PWA demonstrativa de atendimento em tempo real do K2TAP.',
  manifest: '/garcom/manifest.webmanifest',
  robots: {
    index: false,
    follow: false,
  },
  appleWebApp: {
    capable: true,
    title: 'K2TAP Garçom',
    statusBarStyle: 'black-translucent',
  },
}

export default function WaiterLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children
}
