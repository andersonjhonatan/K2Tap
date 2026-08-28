import { ArrowRight, Heart, MapPin, QrCode, Star, Wifi } from 'lucide-react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { ExperienceIcon } from '../ExperienceIcon'
import type { ExperienceProps } from './types'
import styles from '../showcase.module.css'

export function ExperienceHeader({ project }: { project: ProjectConfig }) {
  return (
    <>
      <div className={styles.experienceLogo}>K2</div>
      <small>{project.experience.eyebrow}</small>
      <h3>{project.experience.headline}</h3>
      <p>{project.experience.description}</p>
      <div className={styles.primaryCta}>{project.experience.primaryCta}</div>
    </>
  )
}

export function ActionGrid({
  project,
  onOpenFacility,
}: {
  project: ProjectConfig
  onOpenFacility: (kind: FacilityKind, trigger: HTMLButtonElement) => void
}) {
  return (
    <div className={styles.actionGrid}>
      {project.actions.map((action) => {
        const content = (
          <>
            <ExperienceIcon name={action.icon} />
            <b>{action.label}</b>
            <span>{action.description}</span>
          </>
        )

        return action.facility ? (
          <button
            className={styles.actionCard}
            key={action.id}
            type="button"
            onClick={(event) => onOpenFacility(action.facility!, event.currentTarget)}
          >
            {content}
          </button>
        ) : (
          <div className={styles.actionCard} key={action.id}>
            {content}
          </div>
        )
      })}
    </div>
  )
}

const facilities: Array<{
  kind: FacilityKind
  label: string
  description: string
  Icon: typeof Wifi
}> = [
  { kind: 'wifi', label: 'Wi-Fi', description: 'Conecte pelo QR Code.', Icon: Wifi },
  { kind: 'pix', label: 'Pague Fácil', description: 'Pagamento via Pix.', Icon: QrCode },
  { kind: 'social', label: 'Redes sociais', description: 'Siga e acompanhe.', Icon: Heart },
  { kind: 'location', label: 'Localização', description: 'Mapa e compartilhar.', Icon: MapPin },
  { kind: 'review', label: 'Sua opinião', description: 'Avalie a experiência.', Icon: Star },
]

export function FacilityGrid({ onOpenFacility }: Pick<ExperienceProps, 'onOpenFacility'>) {
  return (
    <div className={styles.facilities}>
      <small>FACILIDADES</small>
      <div className={styles.facilityGrid}>
        {facilities.map(({ kind, label, description, Icon }) => (
          <button
            className={styles.facilityTool}
            key={kind}
            type="button"
            onClick={(event) => onOpenFacility(kind, event.currentTarget)}
          >
            <Icon size={14} aria-hidden="true" />
            <b>{label}</b>
            <span>{description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Highlight({ project }: { project: ProjectConfig }) {
  return (
    <div className={styles.highlight}>
      <small>{project.highlight.eyebrow}</small>
      <b>{project.highlight.title}</b>
    </div>
  )
}

export function ExperienceFooter() {
  return <div className={styles.experienceFooter}>Experiência demonstrativa • K2 Tap</div>
}

export function SocialShortcut({ onOpenFacility }: Pick<ExperienceProps, 'onOpenFacility'>) {
  return (
    <button
      className={styles.socialInline}
      type="button"
      onClick={(event) => onOpenFacility('social', event.currentTarget)}
    >
      <span>
        <b>Redes sociais</b>
        <span>Instagram • WhatsApp • TikTok</span>
      </span>
      <ArrowRight size={15} aria-hidden="true" />
    </button>
  )
}
