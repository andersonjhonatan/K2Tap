import {
  ActionGrid,
  ExperienceFooter,
  ExperienceHeader,
  Highlight,
  SocialShortcut,
  StaffCallShortcut,
} from './ExperienceParts'
import type { ExperienceProps } from './types'
import styles from '../showcase.module.css'

export function RestaurantExperience({ project, onOpenFacility }: ExperienceProps) {
  return (
    <div className={styles.experience}>
      <ExperienceHeader project={project} />
      <div className={`${styles.artwork} ${styles.restaurantArtwork}`}>
        <div className={styles.artCopy}>
          <small>{project.experience.artworkEyebrow}</small>
          <b>{project.experience.artworkTitle}</b>
          <span>{project.experience.artworkDescription}</span>
        </div>
        <div className={styles.plate} aria-hidden="true" />
      </div>

      <ActionGrid project={project} onOpenFacility={onOpenFacility} />
      <StaffCallShortcut project={project} onOpenFacility={onOpenFacility} />
      <Highlight project={project} />

      {project.openingHours && (
        <section className={styles.hours} aria-label="Horários de funcionamento">
          <div className={styles.hoursHeader}>
            <small>HORÁRIOS DE FUNCIONAMENTO</small>
            <b>{project.openingHours.summary}</b>
            <span>{project.openingHours.period}</span>
          </div>
          <div className={styles.hoursList}>
            {project.openingHours.days.map((item) => (
              <div className={styles.hoursRow} key={item.day}>
                <span>{item.day}</span>
                <b>{item.hours}</b>
              </div>
            ))}
          </div>
        </section>
      )}

      <SocialShortcut onOpenFacility={onOpenFacility} />
      <ExperienceFooter />
    </div>
  )
}
