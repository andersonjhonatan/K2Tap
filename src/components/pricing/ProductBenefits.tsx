import { Battery, CircleGauge, Palette, QrCode, RefreshCw, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import styles from './pricing.styles'

const benefits = [
  { icon: Battery, title: 'Sem bateria', text: 'O NFC funciona sem necessidade de recarga.' },
  { icon: CircleGauge, title: 'Rápido', text: 'A aproximação abre o conteúdo em segundos.' },
  {
    icon: Palette,
    title: 'Personalizável',
    text: 'Cada K2 Tap pode carregar a identidade visual do negócio.',
  },
  { icon: QrCode, title: 'QR Code + NFC', text: 'Duas formas simples e diretas de acesso.' },
  {
    icon: RefreshCw,
    title: 'Atualizável',
    text: 'O conteúdo digital pode evoluir sem substituir o produto físico.',
  },
  {
    icon: Sparkles,
    title: 'Profissional',
    text: 'Mais presença e qualidade na apresentação digital do estabelecimento.',
  },
]

export function ProductBenefits() {
  return (
    <section className={styles.section} aria-labelledby="benefits-title">
      <div className="wrap">
        <Reveal className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Feito para trabalhar todos os dias</span>
          <h2 id="benefits-title">Por que K2 Tap?</h2>
        </Reveal>

        <Reveal className={styles.benefitsGrid}>
          {benefits.map(({ icon: Icon, title, text }) => (
            <article className={styles.benefitCard} key={title}>
              <span className={styles.benefitIcon}>
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
