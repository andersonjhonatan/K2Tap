import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import styles from './landing.styles'

export function ProductPresence() {
  return (
    <section
      className={styles.productPresence}
      id="presenca"
      aria-labelledby="product-presence-title"
    >
      <div className="wrap">
        <Reveal className={styles.presenceCard}>
          <figure className={styles.presenceVisual}>
            <Image
              className={styles.presenceImage}
              src="/images/k2tap-combo.png"
              alt="Cartão NFC e Expositor K2 Tap apresentados juntos"
              width={1335}
              height={1178}
              sizes="(max-width: 900px) calc(100vw - 40px), 650px"
            />
            <figcaption>
              <span>02 formatos</span>
              <span>01 experiência</span>
            </figcaption>
          </figure>

          <div className={styles.presenceCopy}>
            <span className="eyebrow">Uma combinação. Muitas possibilidades.</span>
            <p className={styles.presenceKicker}>Cartão + Expositor</p>
            <h2 id="product-presence-title">Antes da tela, existe um toque.</h2>
            <p className={styles.presenceLead}>
              Um acompanha você. O outro espera no ponto de contato. Entre os dois, uma experiência
              pronta para ser descoberta.
            </p>

            <div className={styles.presenceReveal}>
              <span>
                <i aria-hidden="true" />O próximo passo está mais perto do que parece.
              </span>
              <a href="/comprar#purchase-product-combo">
                Descobrir o Combo
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
