import { ArrowUpRight, Camera, MessageCircle, Music2 } from 'lucide-react'
import type { ProjectConfig } from '@/types/project'
import styles from './facilities.module.css'

const socialIcons = {
  Instagram: Camera,
  WhatsApp: MessageCircle,
  TikTok: Music2,
} as const

export function SocialPanel({ project }: { project: ProjectConfig }) {
  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Os canais ficam reunidos em um só lugar, sem obrigar o cliente a procurar o perfil correto.
      </p>
      <div className={styles.socialList}>
        {project.socials.map((social) => {
          const Icon = socialIcons[social.network]
          return (
            <a key={social.network} href={social.href} target="_blank" rel="noopener noreferrer">
              <span className={styles.socialIcon}>
                <Icon size={16} aria-hidden="true" />
              </span>
              <span>
                <b>{social.network}</b>
                <small>{social.handle}</small>
              </span>
              <ArrowUpRight size={14} aria-hidden="true" />
              <span className="srOnly">Abre em nova aba</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
