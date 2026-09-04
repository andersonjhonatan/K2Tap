import Image from 'next/image'
import { ArrowUpRight, Check } from 'lucide-react'
import type { PurchaseProduct } from '@/data/products'
import { getPurchaseUrl } from '@/data/products'
import { cn } from '@/lib/cn'
import styles from './pricing.styles'

type ProductCardProps = {
  product: PurchaseProduct
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article
      className={cn(styles.productCard, product.featured && styles.featuredProduct)}
      id={`purchase-product-${product.id}`}
      data-product-id={product.id}
    >
      <div className={styles.productTopline}>
        <span>Produto {String(index + 1).padStart(2, '0')}</span>
        {product.badge && <strong>{product.badge}</strong>}
      </div>

      <div className={styles.productMedia}>
        <Image
          className={styles.productImage}
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          sizes="(max-width: 767px) calc(100vw - 42px), (max-width: 1100px) 46vw, 370px"
        />
        <span className={styles.mediaGlow} aria-hidden="true" />
      </div>

      <div className={styles.productBody}>
        <p className={styles.productType}>Aquisição única • sem mensalidade</p>
        <h3>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>

        <div className={styles.productPrice} aria-label={`Preço: ${product.priceLabel}`}>
          <small>por</small>
          <strong>{product.priceLabel}</strong>
        </div>

        <ul className={styles.featureList}>
          {product.features.map((feature) => (
            <li key={feature}>
              <span>
                <Check size={13} strokeWidth={2.5} aria-hidden="true" />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <a
          className={styles.productCta}
          href={getPurchaseUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${product.ctaLabel} por ${product.priceLabel} pelo WhatsApp`}
        >
          {product.ctaLabel}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
