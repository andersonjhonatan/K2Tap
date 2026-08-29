import type { CSSProperties, ReactNode } from 'react'
import type { ProjectId } from '@/types/project'
import styles from './artwork.module.css'

const decorations: Record<ProjectId, { className: string; decoration: ReactNode }> = {
  restaurant: {
    className: styles.restaurant,
    decoration: <div className={styles.plate} aria-hidden="true" />,
  },
  barber: {
    className: styles.barber,
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
    className: styles.store,
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
    className: styles.service,
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

type ExperienceArtworkProps = {
  projectId: ProjectId
  eyebrow: string
  title: string
  description: string
  /**
   * Multiplica toda a composição. Quando não vem, quem chama controla pelo CSS
   * com `--art-scale`, o que permite variar por breakpoint.
   */
  scale?: number
  className?: string
}

/**
 * A composição visual de cada negócio. As decorações são posicionadas em
 * absoluto e o texto fica acima delas por z-index, então a ordem não importa.
 */
export function ExperienceArtwork({
  projectId,
  eyebrow,
  title,
  description,
  scale,
  className = '',
}: ExperienceArtworkProps) {
  const { className: theme, decoration } = decorations[projectId]

  return (
    <div
      className={`${styles.artwork} ${theme} ${className}`}
      style={scale ? ({ '--art-scale': scale } as CSSProperties) : undefined}
    >
      <div className={styles.copy}>
        <small>{eyebrow}</small>
        <b>{title}</b>
        <span>{description}</span>
      </div>
      {decoration}
    </div>
  )
}
