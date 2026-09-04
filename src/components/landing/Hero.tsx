import { ArrowRight, Radio, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import styles from './landing.styles'

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCanvas} aria-hidden="true">
        <span className={styles.canvasGlow} />
        <span className={styles.canvasPanel} />
        <span className={styles.canvasRibbon} />
      </div>
      <div className={cn('wrap', styles.heroGrid)}>
        <div className={styles.heroCopy}>
          <span className="eyebrow">K2 Tap • NFC inteligente</span>
          <h1 id="hero-title">
            Encoste.
            <br />
            <span className={styles.stroke}>Conecte.</span>
            <br />
            Continue.
          </h1>
          <p className={styles.lead}>
            Uma peça física personalizada que leva seu cliente, em segundos, para a experiência
            digital certa — sem digitar endereço e sem complicação.
          </p>
          <div className={styles.actions}>
            <Button href="#contato">
              Quero criar minha K2 Tap
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button href="#como" variant="ghost">
              Entender em 30 segundos
            </Button>
          </div>
          <div className={styles.trust} aria-label="Benefícios da K2 Tap">
            <span>
              <i /> NFC + experiência web
            </span>
            <span>
              <i /> Personalizável
            </span>
            <span>
              <i /> Sem app para quem toca
            </span>
          </div>
        </div>

        <div className={styles.stage} aria-label="Representação visual da K2 Tap e celular">
          <div className={styles.stageAmbience} aria-hidden="true">
            <span className={styles.orbitPrimary} />
            <span className={styles.orbitSecondary} />
            <span className={styles.ambientSpark} />
          </div>
          <div className={styles.halo} />
          <div className={styles.phone}>
            <div className={styles.screen}>
              <div className={styles.profileTop}>
                <div className={styles.avatar}>K2</div>
                <strong className={styles.profileName}>K2 Coffee</strong>
                <p>Seu café, do seu jeito.</p>
              </div>
              <div className={styles.quick}>
                <span>WhatsApp</span>
                <span>Cardápio</span>
                <span>Mapa</span>
              </div>
              <div className={styles.profileLink}>
                <i>
                  <Star size={15} aria-hidden="true" />
                </i>
                <div>
                  Avalie sua experiência
                  <small>Google Reviews</small>
                </div>
              </div>
              <div className={styles.profileLink}>
                <i>
                  <Sparkles size={15} aria-hidden="true" />
                </i>
                <div>
                  Veja as novidades
                  <small>Instagram</small>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.tag}>
            <div className={styles.tagBrand}>
              K2 <b>TAP</b>
            </div>
            <div className={styles.tagNfc}>
              <Radio size={20} aria-hidden="true" />
            </div>
            <div className={styles.tagCopy}>
              APROXIME SEU CELULAR
              <br />
              <b>E DESCUBRA.</b>
            </div>
          </div>
          <div className={styles.waves} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.signalBadge} aria-hidden="true">
            <i />
            <span>
              <small>Sinal ativo</small>
              <b>NFC pronto</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
