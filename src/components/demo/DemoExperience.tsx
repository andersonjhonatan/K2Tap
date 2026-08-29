'use client'

import type { CSSProperties } from 'react'
import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ConciergeBell } from 'lucide-react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { siteConfig } from '@/config/site'
import { useClipboard } from '@/hooks/useClipboard'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/feedback/Toast'
import { ExperienceIcon } from '@/components/showcase/ExperienceIcon'
import { DemoBar } from './DemoBar'
import { DemoModal, demoFacilities, facilityMeta, type DemoFacility } from './DemoModal'
import { DemoStaffCall } from './DemoStaffCall'
import styles from './demo.module.css'

type DemoExperienceProps = {
  project: ProjectConfig
  /** Mesa lida da rota quando a demonstração abre a partir de uma peça de mesa. */
  table?: string
}

const isDemoFacility = (facility?: FacilityKind): facility is DemoFacility =>
  facility !== undefined && facility !== 'staff'

export function DemoExperience({ project, table }: DemoExperienceProps) {
  const [activeFacility, setActiveFacility] = useState<DemoFacility | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const copy = useClipboard()
  const { toast, showToast, dismiss } = useToast()

  const theme = {
    '--experience-bg': project.theme.background,
    '--experience-fg': project.theme.foreground,
    '--experience-muted': project.theme.muted,
    '--experience-accent': project.theme.accent,
    '--experience-surface': project.theme.surface,
    '--experience-border': project.theme.border,
  } as CSSProperties

  const openFacility = (facility: DemoFacility, trigger: HTMLButtonElement) => {
    openerRef.current = trigger
    setActiveFacility(facility)
  }

  const closeFacility = useCallback(() => {
    setActiveFacility(null)
    requestAnimationFrame(() => openerRef.current?.focus())
  }, [])

  const handleCopy = useCallback(
    async (value: string, title?: string, description?: string) => {
      const copied = await copy(value)
      showToast(
        copied
          ? {
              title: title ?? 'Copiado com sucesso',
              description: description ?? 'O conteúdo já está na sua área de transferência.',
              variant: 'success',
            }
          : {
              title: 'Não foi possível copiar',
              description: 'Toque e segure o conteúdo para copiar manualmente.',
              variant: 'error',
            },
      )
      return copied
    },
    [copy, showToast],
  )

  const notify = useCallback(
    (title: string, description: string) => showToast({ title, description, variant: 'success' }),
    [showToast],
  )

  return (
    <div className={styles.page} style={theme}>
      <DemoBar projectName={project.name} context={table ? `Mesa ${table}` : undefined} />

      <main className={styles.content}>
        <header className={styles.hero}>
          {table && (
            <span className={styles.heroTable}>
              <ConciergeBell size={14} aria-hidden="true" />
              Mesa {table}
            </span>
          )}
          <div className={styles.heroLogo}>K2</div>
          <small>{project.experience.eyebrow}</small>
          <h1>{project.experience.headline}</h1>
          <p>{project.experience.description}</p>
          <div className={styles.heroActions}>
            <span className={styles.heroCta}>{project.experience.primaryCta}</span>
            {project.staffCall && (
              <a className={styles.heroGhost} href="#chamar">
                {project.staffCall.actionLabel}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        </header>

        {table && project.staffCall && (
          <DemoStaffCall staffCall={project.staffCall} table={table} />
        )}

        <nav className={styles.actionGrid} aria-label="Atalhos da experiência">
          {project.actions.map((action) => {
            const inner = (
              <>
                <span className={styles.actionIcon}>
                  <ExperienceIcon name={action.icon} size={19} />
                </span>
                <b>{action.label}</b>
                <span>{action.description}</span>
              </>
            )

            return isDemoFacility(action.facility) ? (
              <button
                className={styles.actionCard}
                key={action.id}
                type="button"
                onClick={(event) =>
                  openFacility(action.facility as DemoFacility, event.currentTarget)
                }
              >
                {inner}
              </button>
            ) : (
              <div className={styles.actionCard} key={action.id}>
                {inner}
              </div>
            )
          })}
        </nav>

        {!table && project.staffCall && <DemoStaffCall staffCall={project.staffCall} />}

        <div className={styles.highlight}>
          <small>{project.highlight.eyebrow}</small>
          <b>{project.highlight.title}</b>
        </div>

        <section className={styles.facilities} aria-labelledby="facilities-title">
          <h2 id="facilities-title">Facilidades da casa</h2>
          <div className={styles.facilityRow}>
            {demoFacilities.map((facility) => {
              const { label, subtitle, Icon } = facilityMeta[facility]
              return (
                <button
                  className={styles.facilityChip}
                  key={facility}
                  type="button"
                  onClick={(event) => openFacility(facility, event.currentTarget)}
                >
                  <span className={styles.facilityChipIcon}>
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span>
                    <b>{label}</b>
                    <small>{subtitle}</small>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {project.openingHours && (
          <section className={styles.block} aria-labelledby="hours-title">
            <div className={styles.blockHead}>
              <small>HORÁRIOS DE FUNCIONAMENTO</small>
              <h2 id="hours-title">{project.openingHours.summary}</h2>
              <p>{project.openingHours.period}</p>
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
      </main>

      <footer className={styles.footer}>
        <b>Esta experiência abre com um toque na peça {siteConfig.name}.</b>
        <span>
          Demonstração com dados fictícios de {project.name}. Na sua empresa, a página nasce com a
          sua marca, o seu conteúdo e só com o que você precisa.
        </span>
        <div className={styles.footerActions}>
          <a href={siteConfig.commercialUrl} target="_blank" rel="noopener noreferrer">
            Quero isso na minha empresa
            <ArrowRight size={15} aria-hidden="true" />
          </a>
          <Link href="/#experiencias">Ver outros exemplos</Link>
        </div>
      </footer>

      {activeFacility && (
        <DemoModal
          facility={activeFacility}
          project={project}
          onSelect={setActiveFacility}
          onClose={closeFacility}
          onCopy={handleCopy}
          onNotify={notify}
        />
      )}

      <div className={styles.toastHost}>
        <Toast toast={toast} onDismiss={dismiss} />
      </div>
    </div>
  )
}
