import { ArrowRight } from 'lucide-react'
import type { ProjectConfig, ProjectIcon } from '@/types/project'
import { cn } from '@/lib/cn'
import { ExperienceIcon } from './ExperienceIcon'
import styles from './showcase.styles'

const tabIcons: Record<ProjectConfig['id'], ProjectIcon> = {
  restaurant: 'utensils',
  barber: 'scissors',
  store: 'shopping-bag',
  service: 'briefcase',
}

type ProjectSelectorProps = {
  projects: ProjectConfig[]
  activeProject: ProjectConfig['id']
  onSelect: (project: ProjectConfig['id']) => void
}

export function ProjectSelector({ projects, activeProject, onSelect }: ProjectSelectorProps) {
  return (
    <div className={styles.selector} role="tablist" aria-label="Projetos fictícios K2 Tap">
      {projects.map((project) => {
        const active = project.id === activeProject
        return (
          <button
            className={cn(styles.projectTab, active && styles.activeTab)}
            key={project.id}
            type="button"
            role="tab"
            id={`project-tab-${project.id}`}
            aria-selected={active}
            aria-controls="project-phone-panel"
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(project.id)}
          >
            <span className={styles.tabIcon}>
              <ExperienceIcon name={tabIcons[project.id]} size={17} />
            </span>
            <span>
              <b>{project.name}</b>
              <small>{project.tabDescription}</small>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
