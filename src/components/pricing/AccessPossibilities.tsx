import {
  AtSign,
  BookOpen,
  BriefcaseBusiness,
  Contact,
  CreditCard,
  Globe2,
  Link2,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Star,
  Wifi,
} from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import styles from './pricing.styles'

const possibilities = [
  { icon: AtSign, label: 'Redes sociais' },
  { icon: MessageCircle, label: 'WhatsApp' },
  { icon: BookOpen, label: 'Cardápio' },
  { icon: ShoppingBag, label: 'Catálogo' },
  { icon: Wifi, label: 'Wi-Fi' },
  { icon: MapPin, label: 'Localização' },
  { icon: Star, label: 'Avaliações' },
  { icon: CreditCard, label: 'Pagamentos' },
  { icon: BriefcaseBusiness, label: 'Portfólio' },
  { icon: Contact, label: 'Contatos' },
  { icon: Globe2, label: 'Site' },
  { icon: Link2, label: 'Links personalizados' },
]

export function AccessPossibilities() {
  return (
    <section className={styles.accessSection} aria-labelledby="access-title">
      <div className={cn('wrap', styles.accessGrid)}>
        <Reveal className={styles.accessCopy}>
          <span className={styles.eyebrow}>Um toque. Muitos destinos.</span>
          <h2 id="access-title">Tudo o que seu cliente precisa acessar.</h2>
          <p>
            O produto físico abre uma experiência digital organizada para o momento e para a sua
            marca — sem exigir aplicativo.
          </p>
        </Reveal>

        <Reveal className={styles.possibilitiesGrid}>
          {possibilities.map(({ icon: Icon, label }) => (
            <div className={styles.possibility} key={label}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
