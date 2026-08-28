import type { FacilityKind, ProjectConfig } from '@/types/project'

export type ExperienceProps = {
  project: ProjectConfig
  onOpenFacility: (kind: FacilityKind, trigger: HTMLButtonElement) => void
}
