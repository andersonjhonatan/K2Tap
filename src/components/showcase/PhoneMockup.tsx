import type { ReactNode } from 'react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { MobileExperience } from './MobileExperience'
import styles from './showcase.module.css'

type PhoneMockupProps = {
  project: ProjectConfig
  modal: ReactNode
  onOpenFacility: (kind: FacilityKind, trigger: HTMLButtonElement) => void
}

export function PhoneMockup({ project, modal, onOpenFacility }: PhoneMockupProps) {
  return (
    <div>
      <div
        className={styles.phoneShell}
        aria-label={`Prévia mobile da experiência ${project.name}`}
      >
        <MobileExperience key={project.id} project={project} onOpenFacility={onOpenFacility} />
        {modal}
      </div>
      <p className={styles.mobileHint}>
        Deslize dentro do celular para explorar a experiência completa.
      </p>
    </div>
  )
}
