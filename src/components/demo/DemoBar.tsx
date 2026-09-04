import Link from 'next/link'
import { ArrowLeft, Radio } from 'lucide-react'
import { siteConfig } from '@/config/site'
import styles from './demo.styles'

type DemoBarProps = {
  projectName: string
  context?: string
}

export function DemoBar({ projectName, context }: DemoBarProps) {
  return (
    <div className={styles.demoBar}>
      <Link className={styles.demoBack} href="/#experiencias">
        <ArrowLeft size={14} aria-hidden="true" />
        <span>Voltar ao site</span>
      </Link>
      <div className={styles.demoBarCopy}>
        <Radio size={13} aria-hidden="true" />
        <span>
          <b>{siteConfig.name}</b> rodando para <b>{projectName}</b>
          {context ? ` • ${context}` : ''}
        </span>
      </div>
      <span className={styles.demoBadgeTag}>demonstração</span>
    </div>
  )
}
