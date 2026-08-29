import type { CSSProperties } from 'react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { ExperienceArtwork } from './experiences/ExperienceArtwork'
import {
  ActionGrid,
  ExperienceFooter,
  ExperienceHeader,
  FacilityGrid,
  Highlight,
  OpeningHours,
  SocialShortcut,
  StaffCallShortcut,
} from './experiences/ExperienceParts'
import styles from './showcase.module.css'

type MobileExperienceProps = {
  project: ProjectConfig
  onOpenFacility: (kind: FacilityKind, trigger: HTMLButtonElement) => void
}

export function MobileExperience({ project, onOpenFacility }: MobileExperienceProps) {
  const theme = {
    '--experience-bg': project.theme.background,
    '--experience-fg': project.theme.foreground,
    '--experience-muted': project.theme.muted,
    '--experience-accent': project.theme.accent,
    '--experience-surface': project.theme.surface,
    '--experience-border': project.theme.border,
  } as CSSProperties

  // Quando as ações do projeto já levam às facilidades, a grade completa seria
  // repetição: nesse caso basta o atalho das redes, que fica de fora delas.
  const actionsCoverFacilities = project.actions.some((action) => action.facility)

  return (
    <div className={styles.phoneView} style={theme} data-testid="mobile-experience">
      <div className={styles.experience}>
        <ExperienceHeader project={project} />
        <ExperienceArtwork
          projectId={project.id}
          eyebrow={project.experience.artworkEyebrow}
          title={project.experience.artworkTitle}
          description={project.experience.artworkDescription}
        />

        <ActionGrid project={project} onOpenFacility={onOpenFacility} />
        <StaffCallShortcut project={project} onOpenFacility={onOpenFacility} />
        <Highlight project={project} />
        <OpeningHours openingHours={project.openingHours} />

        {actionsCoverFacilities ? (
          <SocialShortcut onOpenFacility={onOpenFacility} />
        ) : (
          <FacilityGrid onOpenFacility={onOpenFacility} />
        )}

        <ExperienceFooter />
      </div>
    </div>
  )
}
