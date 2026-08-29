import type { ProjectId } from '@/types/project'
import styles from '../showcase.module.css'

/**
 * Decoração da arte de cada projeto. Todas são posicionadas em absoluto e o
 * texto fica acima delas por z-index, então a ordem no DOM não importa.
 */
const decorations: Record<ProjectId, { className: string; decoration: React.ReactNode }> = {
  restaurant: {
    className: styles.restaurantArtwork,
    decoration: <div className={styles.plate} aria-hidden="true" />,
  },
  barber: {
    className: styles.barberArtwork,
    decoration: (
      <>
        <div className={styles.barberLines} aria-hidden="true" />
        <div className={styles.barberMark} aria-hidden="true">
          K2
        </div>
      </>
    ),
  },
  store: {
    className: styles.storeArtwork,
    decoration: (
      <>
        <div className={styles.storeEdition} aria-hidden="true">
          26
        </div>
        <div className={styles.swatches} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </>
    ),
  },
  service: {
    className: styles.serviceArtwork,
    decoration: (
      <>
        <div className={styles.serviceGrid} aria-hidden="true" />
        <div className={styles.serviceUi} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </>
    ),
  },
}

export function ExperienceArtwork({
  projectId,
  eyebrow,
  title,
  description,
}: {
  projectId: ProjectId
  eyebrow: string
  title: string
  description: string
}) {
  const { className, decoration } = decorations[projectId]

  return (
    <div className={`${styles.artwork} ${className}`}>
      <div className={styles.artCopy}>
        <small>{eyebrow}</small>
        <b>{title}</b>
        <span>{description}</span>
      </div>
      {decoration}
    </div>
  )
}
