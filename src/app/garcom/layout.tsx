import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Painel da equipe | ${siteConfig.name}`,
  description: 'Painel demonstrativo de chamados para quem atende o salão.',
  manifest: '/garcom.webmanifest',
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: `${siteConfig.name} Garçom`,
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#071321',
  colorScheme: 'dark',
}

export default function WaiterLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children
}
