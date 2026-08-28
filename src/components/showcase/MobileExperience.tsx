import type { CSSProperties } from 'react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { BarberExperience } from './experiences/BarberExperience'
import { RestaurantExperience } from './experiences/RestaurantExperience'
import { ServiceExperience } from './experiences/ServiceExperience'
import { StoreExperience } from './experiences/StoreExperience'
import styles from './showcase.module.css'

type MobileExperienceProps = {
  project: ProjectConfig
  onOpenFacility: (kind: FacilityKind, trigger: HTMLButtonElement) => void
}

const experienceComponents = {
  restaurant: RestaurantExperience,
  barber: BarberExperience,
  store: StoreExperience,
  service: ServiceExperience,
} as const

export function MobileExperience({ project, onOpenFacility }: MobileExperienceProps) {
  const Experience = experienceComponents[project.id]
  const theme = {
    '--experience-bg': project.theme.background,
    '--experience-fg': project.theme.foreground,
    '--experience-muted': project.theme.muted,
    '--experience-accent': project.theme.accent,
    '--experience-surface': project.theme.surface,
    '--experience-border': project.theme.border,
  } as CSSProperties

  return (
    <div className={styles.phoneView} style={theme} data-testid="mobile-experience">
      <Experience project={project} onOpenFacility={onOpenFacility} />
    </div>
  )
}
