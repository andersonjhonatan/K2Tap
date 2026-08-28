import styles from './ui.module.css'

type BrandProps = {
  compact?: boolean
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <span className={styles.brand}>
      <span className={styles.brandMark} aria-hidden="true">
        <span>K2</span>
      </span>
      {!compact && (
        <span className={styles.brandText}>
          K2 TAP
          <small>by K2 Tech</small>
        </span>
      )}
    </span>
  )
}
