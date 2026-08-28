import {
  ActionGrid,
  ExperienceFooter,
  ExperienceHeader,
  FacilityGrid,
  Highlight,
} from './ExperienceParts'
import type { ExperienceProps } from './types'
import styles from '../showcase.module.css'

export function BarberExperience({ project, onOpenFacility }: ExperienceProps) {
  return (
    <div className={styles.experience}>
      <ExperienceHeader project={project} />
      <div className={`${styles.artwork} ${styles.barberArtwork}`}>
        <div className={styles.barberLines} aria-hidden="true" />
        <div className={styles.artCopy}>
          <small>{project.experience.artworkEyebrow}</small>
          <b>{project.experience.artworkTitle}</b>
          <span>{project.experience.artworkDescription}</span>
        </div>
        <div className={styles.barberMark} aria-hidden="true">
          K2
        </div>
      </div>
      <ActionGrid project={project} onOpenFacility={onOpenFacility} />
      <Highlight project={project} />
      <FacilityGrid onOpenFacility={onOpenFacility} />
      <ExperienceFooter />
    </div>
  )
}
