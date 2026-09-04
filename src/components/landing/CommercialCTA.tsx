import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import styles from './landing.styles'

export function CommercialCTA() {
  return (
    <section className={styles.cta} id="contato" aria-labelledby="commercial-title">
      <div className="wrap">
        <Reveal className={styles.ctaBox}>
          <h2 id="commercial-title">
            Seu próximo contato com o cliente pode começar com um toque.
          </h2>
          <div className={styles.ctaRight}>
            <p>
              Conte onde você pretende usar a K2 Tap. A K2 Tech pode montar a combinação de peça
              física, identidade e experiência digital para o seu negócio.
            </p>
            <Button href={siteConfig.commercialUrl} variant="light" external>
              {siteConfig.commercialLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
