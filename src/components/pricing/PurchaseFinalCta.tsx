import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { comboProduct, getPurchaseUrl } from '@/data/products'
import { Reveal } from '@/components/ui/Reveal'
import styles from './pricing.module.css'

export function PurchaseFinalCta() {
  return (
    <section className={styles.finalSection} aria-labelledby="final-cta-title">
      <div className="wrap">
        <Reveal className={styles.finalCard}>
          <div className={styles.finalCopy}>
            <span className={styles.eyebrow}>A escolha completa</span>
            <h2 id="final-cta-title">Leve o K2 Tap com você e para o seu negócio.</h2>
            <p>Cartão + Expositor, juntos em uma experiência física e digital consistente.</p>
            <div className={styles.finalPrice}>
              <small>Combo K2 Tap</small>
              <strong>{comboProduct.priceLabel}</strong>
            </div>
            <a
              href={getPurchaseUrl(comboProduct)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero o Combo K2 Tap
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.finalVisual}>
            <Image
              src={comboProduct.image.src}
              alt="Cartão e Expositor do Combo K2 Tap"
              width={comboProduct.image.width}
              height={comboProduct.image.height}
              sizes="(max-width: 800px) calc(100vw - 40px), 520px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
