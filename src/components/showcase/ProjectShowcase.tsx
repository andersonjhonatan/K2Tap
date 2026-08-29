'use client'

import { useCallback, useRef, useState } from 'react'
import { projects } from '@/data/projects'
import type { FacilityKind, ProjectId } from '@/types/project'
import { FacilitiesModal } from '@/components/facilities/FacilitiesModal'
import { DemoLaunch } from './DemoLaunch'
import { PhoneMockup } from './PhoneMockup'
import { ProjectSelector } from './ProjectSelector'
import styles from './showcase.module.css'

export function ProjectShowcase() {
  const [activeProjectId, setActiveProjectId] = useState<ProjectId>('restaurant')
  const [activeFacility, setActiveFacility] = useState<FacilityKind | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0]

  const closeFacility = useCallback(() => {
    setActiveFacility(null)
    requestAnimationFrame(() => openerRef.current?.focus())
  }, [])

  const openFacility = useCallback((kind: FacilityKind, trigger: HTMLButtonElement) => {
    openerRef.current = trigger
    setActiveFacility(kind)
  }, [])

  const selectProject = (projectId: ProjectId) => {
    setActiveFacility(null)
    openerRef.current = null
    setActiveProjectId(projectId)
  }

  return (
    <section className={styles.showcaseSection} id="experiencias" aria-labelledby="showcase-title">
      <div className="wrap">
        <div className={styles.showcase}>
          <div className={styles.showcaseHeader}>
            <div>
              <span className="eyebrow">Experiência pós-Tap</span>
              <h2 id="showcase-title">É isso que abre no celular do cliente.</h2>
            </div>
            <p>
              Depois de encostar o celular na K2 Tap, o cliente entra direto em uma experiência
              mobile feita para aquele negócio. Escolha um exemplo abaixo e veja como pode ficar.
            </p>
          </div>

          <ProjectSelector
            projects={projects}
            activeProject={activeProjectId}
            onSelect={selectProject}
          />

          <div className={styles.stage}>
            <div className={styles.toolbar}>
              <small>EXPERIÊNCIA MOBILE / PÓS-TAP</small>
              <span>projeto demonstrativo ativo</span>
            </div>
            <div
              className={styles.mobileShowcase}
              id="project-phone-panel"
              role="tabpanel"
              aria-labelledby={`project-tab-${activeProjectId}`}
            >
              <PhoneMockup
                project={activeProject}
                onOpenFacility={openFacility}
                modal={
                  activeFacility ? (
                    <FacilitiesModal
                      project={activeProject}
                      initialFacility={activeFacility}
                      onClose={closeFacility}
                    />
                  ) : null
                }
              />
            </div>
          </div>

          <DemoLaunch project={activeProject} />
        </div>
      </div>
    </section>
  )
}
