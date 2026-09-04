import type { FacilityKind, ProjectConfig } from '@/types/project'
import { experienceTheme } from '@/lib/theme'
import { ExperienceArtwork } from '@/components/artwork/ExperienceArtwork'
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
import styles from './showcase.styles'

type MobileExperienceProps = {
  project: ProjectConfig
  onOpenFacility: (kind: FacilityKind, trigger: HTMLButtonElement) => void
}

export function MobileExperience({ project, onOpenFacility }: MobileExperienceProps) {
  const theme = experienceTheme(project.theme)

  // Quando as ações do projeto já levam às facilidades, a grade completa seria
  // repetição: nesse caso basta o atalho das redes, que fica de fora delas.
  const actionsCoverFacilities = project.actions.some((action) => action.facility)

  return (
    <div className={styles.phoneView} style={theme} data-testid="mobile-experience">
      <div className={styles.experience}>
        <ExperienceHeader project={project} />
        <ExperienceArtwork
          className={styles.phoneArtwork}
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
