import { MousePointerClick, PackageCheck, Palette, ScanLine, Smartphone } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import styles from './pricing.styles'

const steps = [
  { icon: MousePointerClick, title: 'Escolha seu K2 Tap', text: 'Cartão, Expositor ou Combo.' },
  { icon: Palette, title: 'Personalizamos', text: 'Aplicamos a identidade do seu negócio.' },
  { icon: PackageCheck, title: 'Você recebe', text: 'Seu produto pronto para usar.' },
  { icon: ScanLine, title: 'O cliente acessa', text: 'Basta aproximar ou escanear.' },
  { icon: Smartphone, title: 'A experiência abre', text: 'O conteúdo digital aparece no celular.' },
]

export function HowItWorks() {
  return (
    <section className={cn(styles.section, styles.howSection)} aria-labelledby="how-title">
      <div className="wrap">
        <Reveal className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Simples do início ao Tap</span>
          <h2 id="how-title">Como funciona?</h2>
        </Reveal>

        <Reveal className={styles.stepsGrid}>
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article className={styles.stepCard} key={title}>
              <div className={styles.stepTopline}>
                <span>
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <small>{String(index + 1).padStart(2, '0')}</small>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
