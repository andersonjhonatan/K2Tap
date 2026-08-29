import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ProjectConfig } from '@/types/project'
import styles from './showcase.module.css'

export function DemoLaunch({ project }: { project: ProjectConfig }) {
  return (
    <div className={styles.launch}>
      <Link
        className={styles.launchCard}
        href={`/demo/${project.slug}`}
        aria-label={`Veja como fica na sua empresa: abrir a demonstração de ${project.name}`}
      >
        <span className={styles.launchEyebrow}>Demonstração real</span>
        <span className={styles.launchTitle}>
          <span aria-hidden="true">Veja como fica</span>
          <em aria-hidden="true">na sua empresa</em>
        </span>
        <span className={styles.launchLead}>
          A experiência de {project.name} em tela cheia, funcionando como se o sistema já estivesse
          contratado.
        </span>
        <span className={styles.launchCta}>
          Abrir demonstração
          <ArrowRight size={18} aria-hidden="true" />
        </span>
      </Link>
    </div>
  )
}
