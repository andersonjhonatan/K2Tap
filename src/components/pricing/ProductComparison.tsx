import { Check, Minus } from 'lucide-react'
import { comparisonRows, products } from '@/data/products'
import type { PurchaseProductId } from '@/data/products'
import { Reveal } from '@/components/ui/Reveal'
import styles from './pricing.module.css'

function Availability({ available }: { available: boolean }) {
  return available ? (
    <span className={styles.available} aria-label="Incluído">
      <Check size={16} strokeWidth={2.5} aria-hidden="true" />
    </span>
  ) : (
    <span className={styles.unavailable} aria-label="Não incluído">
      <Minus size={15} aria-hidden="true" />
    </span>
  )
}

export function ProductComparison() {
  return (
    <section className={styles.section} aria-labelledby="comparison-title">
      <div className="wrap">
        <Reveal className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Compare com clareza</span>
          <h2 id="comparison-title">Qual K2 Tap é ideal para você?</h2>
          <p>Três formatos, a mesma experiência simples e tecnológica.</p>
        </Reveal>

        <Reveal className={styles.comparisonDesktop}>
          <div className={styles.comparisonHeader}>
            <span>Recursos</span>
            {products.map((product) => (
              <div className={product.featured ? styles.comparisonFeatured : ''} key={product.id}>
                <strong>{product.shortName}</strong>
                <small>{product.priceLabel}</small>
              </div>
            ))}
          </div>
          {comparisonRows.map((row) => (
            <div className={styles.comparisonRow} key={row.label}>
              <strong>{row.label}</strong>
              {products.map((product) => (
                <div key={product.id}>
                  <Availability available={row[product.id]} />
                </div>
              ))}
            </div>
          ))}
        </Reveal>

        <div className={styles.comparisonMobile}>
          {products.map((product) => (
            <Reveal
              className={`${styles.comparisonMobileCard} ${product.featured ? styles.comparisonMobileFeatured : ''}`}
              key={product.id}
            >
              <div>
                <h3>{product.shortName}</h3>
                <strong>{product.priceLabel}</strong>
              </div>
              <ul>
                {comparisonRows.map((row) => (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <Availability available={row[product.id as PurchaseProductId]} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
