import { ArrowRight, ConciergeBell } from 'lucide-react'
import type { FacilityKind, OpeningHour, ProjectConfig } from '@/types/project'
import { customerFacilities, facilityIcons, facilityLabels } from '@/data/facilities'
import { ExperienceIcon } from '../ExperienceIcon'
import type { ExperienceProps } from './types'
import styles from '../showcase.styles'

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
            aria-label={`${action.label} ${action.description}`}
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

const facilityHints: Record<(typeof customerFacilities)[number], string> = {
  wifi: 'Conecte pelo QR Code.',
  pix: 'Pagamento via Pix.',
  social: 'Siga e acompanhe.',
  location: 'Mapa e compartilhar.',
  review: 'Avalie a experiência.',
}

export function FacilityGrid({ onOpenFacility }: Pick<ExperienceProps, 'onOpenFacility'>) {
  return (
    <div className={styles.facilities}>
      <small>FACILIDADES</small>
      <div className={styles.facilityGrid}>
        {customerFacilities.map((facility) => {
          const Icon = facilityIcons[facility]
          return (
            <button
              className={styles.facilityTool}
              key={facility}
              type="button"
              aria-label={`${facilityLabels[facility]} ${facilityHints[facility]}`}
              onClick={(event) => onOpenFacility(facility, event.currentTarget)}
            >
              <Icon size={14} aria-hidden="true" />
              <b>{facilityLabels[facility]}</b>
              <span>{facilityHints[facility]}</span>
            </button>
          )
        })}
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

export function StaffCallShortcut({
  project,
  onOpenFacility,
}: {
  project: ProjectConfig
  onOpenFacility: (kind: FacilityKind, trigger: HTMLButtonElement) => void
}) {
  const staffCall = project.staffCall
  if (!staffCall) return null

  return (
    <button
      className={styles.staffCall}
      type="button"
      onClick={(event) => onOpenFacility('staff', event.currentTarget)}
    >
      <span className={styles.staffCallIcon} aria-hidden="true">
        <ConciergeBell size={17} />
        <i />
      </span>
      <span className={styles.staffCallCopy}>
        <small>PRECISA DE ALGUMA COISA?</small>
        <b>{staffCall.actionLabel}</b>
        <span>
          {staffCall.spot} • {staffCall.actionDescription}
        </span>
      </span>
      <ArrowRight size={15} aria-hidden="true" />
    </button>
  )
}

export function OpeningHours({ openingHours }: { openingHours?: ProjectConfig['openingHours'] }) {
  if (!openingHours) return null

  return (
    <section className={styles.hours} aria-label="Horários de funcionamento">
      <div className={styles.hoursHeader}>
        <small>HORÁRIOS DE FUNCIONAMENTO</small>
        <b>{openingHours.summary}</b>
        <span>{openingHours.period}</span>
      </div>
      <div className={styles.hoursList}>
        {openingHours.days.map((item: OpeningHour) => (
          <div className={styles.hoursRow} key={item.day}>
            <span>{item.day}</span>
            <b>{item.hours}</b>
          </div>
        ))}
      </div>
    </section>
  )
}
