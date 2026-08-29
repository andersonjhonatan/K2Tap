import Link from 'next/link'
import { ArrowRight, ConciergeBell, Smartphone } from 'lucide-react'
import type { ProjectConfig } from '@/types/project'
import styles from './showcase.module.css'

export function DemoLaunch({ project }: { project: ProjectConfig }) {
  const staffCall = project.staffCall

  return (
    <div className={styles.launch}>
      <Link className={styles.launchButton} href={`/demo/${project.slug}`}>
        <span className={styles.launchCopy}>
          <small>DEMONSTRAÇÃO REAL</small>
          <b>Veja como fica na sua empresa</b>
          <span>
            Abre a experiência de {project.name} em tela cheia, funcionando como se o sistema já
            estivesse contratado.
          </span>
        </span>
        <span className={styles.launchIcon} aria-hidden="true">
          <ArrowRight size={20} />
        </span>
      </Link>

      {staffCall && (
        <div className={styles.launchExtras}>
          <span>Ou entre direto por uma ponta do atendimento:</span>
          <Link href={staffCall.customerPath}>
            <Smartphone size={14} aria-hidden="true" />
            Tela do cliente na {staffCall.spot.toLowerCase()}
          </Link>
          <Link href={staffCall.staffPath}>
            <ConciergeBell size={14} aria-hidden="true" />
            Painel do {staffCall.role.toLowerCase()}
          </Link>
        </div>
      )}
    </div>
  )
}
