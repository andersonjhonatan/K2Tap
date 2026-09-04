import type { Metadata } from 'next'
import { AccessPossibilities } from '@/components/pricing/AccessPossibilities'
import { HowItWorks } from '@/components/pricing/HowItWorks'
import { MobileComboCta } from '@/components/pricing/MobileComboCta'
import { ProductBenefits } from '@/components/pricing/ProductBenefits'
import { ProductCard } from '@/components/pricing/ProductCard'
import { ProductComparison } from '@/components/pricing/ProductComparison'
import { PurchaseFaq } from '@/components/pricing/PurchaseFaq'
import { PurchaseFinalCta } from '@/components/pricing/PurchaseFinalCta'
import { PurchaseHero } from '@/components/pricing/PurchaseHero'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Reveal } from '@/components/ui/Reveal'
import { products } from '@/data/products'
import { siteConfig } from '@/config/site'
import styles from '@/components/pricing/pricing.styles'

export const metadata: Metadata = {
  title: { absolute: 'K2 Tap | Cartão NFC, Expositor e Combo' },
  description:
    'Conheça as soluções K2 Tap. Cartão NFC, Expositor com NFC + QR Code e Combo completo para conectar seu negócio aos seus clientes.',
  alternates: { canonical: '/comprar' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/comprar`,
    siteName: siteConfig.name,
    title: 'K2 Tap | Cartão NFC, Expositor e Combo',
    description:
      'Cartão NFC, Expositor com NFC + QR Code e Combo completo para conectar seu negócio aos seus clientes.',
    images: [
      {
        url: '/images/k2tap-combo.png',
        width: 1335,
        height: 1178,
        alt: 'Combo K2 Tap com Cartão NFC e Expositor',
      },
    ],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Produtos K2 Tap',
  itemListElement: products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: `${siteConfig.url}${product.image.src}`,
      brand: { '@type': 'Brand', name: siteConfig.name },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: product.price.toFixed(2),
        availability: 'https://schema.org/InStock',
        url: `${siteConfig.url}/comprar#purchase-product-${product.id}`,
      },
    },
  })),
}

export default function PurchasePage() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <Header />
      <main className={styles.purchasePage} id="top">
        <PurchaseHero />

        <section className={styles.productsSection} id="produtos" aria-labelledby="products-title">
          <div className="wrap">
            <div className={styles.productsHeading}>
              <div>
                <span className={styles.eyebrow}>Escolha seu formato</span>
                <h2 id="products-title">Um produto físico. Acesso em um toque.</h2>
              </div>
              <p>
                Todos os modelos são personalizados para o seu negócio e vendidos por aquisição
                única, sem mensalidade do produto.
              </p>
            </div>

            <Reveal className={styles.productsGrid}>
              {products.map((product, index) => (
                <ProductCard product={product} index={index} key={product.id} />
              ))}
            </Reveal>
          </div>
        </section>

        <ProductComparison />
        <HowItWorks />
        <AccessPossibilities />
        <ProductBenefits />
        <PurchaseFaq />
        <PurchaseFinalCta />
        <MobileComboCta />
      </main>
      <Footer />
    </>
  )
}
