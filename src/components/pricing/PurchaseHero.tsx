import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Radio } from 'lucide-react'
import { comboProduct, getPurchaseUrl } from '@/data/products'
import styles from './pricing.module.css'

export function PurchaseHero() {
  return (
    <section className={styles.hero} aria-labelledby="purchase-title">
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={`wrap ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <Radio size={15} aria-hidden="true" /> K2 Tap • Produtos físicos
          </span>
          <h1 id="purchase-title">
            Tecnologia que conecta
            <span>seu negócio ao cliente.</span>
          </h1>
          <p>
            Escolha entre Cartão, Expositor ou o Combo completo e conecte seus clientes ao seu
            universo digital com apenas um toque.
          </p>

          <div className={styles.heroActions}>
            <a className={styles.heroPrimary} href="#produtos">
              Ver produtos
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a
              className={styles.heroSecondary}
              href={getPurchaseUrl(comboProduct)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com especialista
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className={styles.heroAssurances} aria-label="Condições dos produtos">
            <span>Compra única</span>
            <span>Sem mensalidade</span>
            <span>Personalizável</span>
          </div>
        </div>

        <figure className={styles.heroVisual}>
          <div className={styles.heroImageFrame}>
            <Image
              className={styles.heroImage}
              src={comboProduct.image.src}
              alt={comboProduct.image.alt}
              width={comboProduct.image.width}
              height={comboProduct.image.height}
              sizes="(max-width: 900px) calc(100vw - 40px), 590px"
              priority
            />
          </div>
          <figcaption>
            <span>Cartão + Expositor</span>
            <strong>Combo K2 Tap</strong>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
