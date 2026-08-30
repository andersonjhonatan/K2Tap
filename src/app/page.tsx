import { CommercialCTA } from '@/components/landing/CommercialCTA'
import { Hero } from '@/components/landing/Hero'
import { NfcDemo } from '@/components/landing/NfcDemo'
import { Possibilities } from '@/components/landing/Possibilities'
import { ProductPresence } from '@/components/landing/ProductPresence'
import { ProductMetrics } from '@/components/landing/ProductMetrics'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ProjectShowcase } from '@/components/showcase/ProjectShowcase'
import { siteConfig } from '@/config/site'
import homeStyles from './home.module.css'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: siteConfig.company,
      url: siteConfig.url,
      brand: { '@type': 'Brand', name: siteConfig.name },
    },
    {
      '@type': 'Product',
      name: siteConfig.name,
      brand: { '@type': 'Brand', name: siteConfig.company },
      description: siteConfig.description,
      category: 'Solução NFC para experiências digitais',
      url: siteConfig.url,
    },
  ],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <Header />
      <main className={homeStyles.siteCanvas} id="top">
        <Hero />
        <NfcDemo />
        <ProductPresence />
        <ProjectShowcase />
        <Possibilities />
        <ProductMetrics />
        <CommercialCTA />
      </main>
      <Footer />
    </>
  )
}
