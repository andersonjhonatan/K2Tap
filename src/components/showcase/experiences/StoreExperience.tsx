import {
  ActionGrid,
  ExperienceFooter,
  ExperienceHeader,
  FacilityGrid,
  Highlight,
} from './ExperienceParts'
import type { ExperienceProps } from './types'
import styles from '../showcase.module.css'

export function StoreExperience({ project, onOpenFacility }: ExperienceProps) {
  return (
    <div className={styles.experience}>
      <ExperienceHeader project={project} />
      <div className={`${styles.artwork} ${styles.storeArtwork}`}>
        <div className={styles.storeEdition} aria-hidden="true">
          26
        </div>
        <div className={styles.artCopy}>
          <small>{project.experience.artworkEyebrow}</small>
          <b>{project.experience.artworkTitle}</b>
          <span>{project.experience.artworkDescription}</span>
        </div>
        <div className={styles.swatches} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <ActionGrid project={project} onOpenFacility={onOpenFacility} />
      <Highlight project={project} />
      <FacilityGrid onOpenFacility={onOpenFacility} />
      <ExperienceFooter />
    </div>
  )
}
