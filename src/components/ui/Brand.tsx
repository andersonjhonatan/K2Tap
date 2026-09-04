import { K2TapLockup, K2TapMark } from '@/components/brand/K2TapLogo'
import styles from './ui.styles'

type BrandProps = {
  /** Só a marca, sem as letras — para espaços apertados. */
  compact?: boolean
  tone?: 'light' | 'dark'
}

export function Brand({ compact = false, tone = 'light' }: BrandProps) {
  if (compact) return <K2TapMark className={styles.brandMark} />

  return (
    <span className={styles.brand}>
      <K2TapLockup className={styles.brandLogo} tone={tone} />
      <small className={styles.brandBy}>by K2 Tech</small>
    </span>
  )
}
