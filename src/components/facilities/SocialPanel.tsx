import { ArrowUpRight } from 'lucide-react'
import type { ProjectConfig } from '@/types/project'
import { SocialIcon } from '@/components/ui/SocialIcon'
import styles from './facilities.module.css'

export function SocialPanel({ project }: { project: ProjectConfig }) {
  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Os canais ficam reunidos em um só lugar, sem obrigar o cliente a procurar o perfil correto.
      </p>
      <div className={styles.socialList}>
        {project.socials.map((social) => (
          <a key={social.network} href={social.href} target="_blank" rel="noopener noreferrer">
            <span className={styles.socialIcon}>
              <SocialIcon network={social.network} />
            </span>
            <span>
              <b>{social.network}</b>
              <small>{social.handle}</small>
            </span>
            <ArrowUpRight size={14} aria-hidden="true" />
            <span className="srOnly">Abre em nova aba</span>
          </a>
        ))}
      </div>
    </div>
  )
}
