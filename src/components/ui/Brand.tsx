import Image from 'next/image'
import { k2TapLogoData } from './k2TapLogo'
import styles from './ui.module.css'

type BrandProps = {
  compact?: boolean
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <span className={`${styles.brand} ${compact ? styles.brandCompact : ''}`}>
      <Image
        className={styles.brandImage}
        src={k2TapLogoData}
        alt="K2 Tap"
        width={540}
        height={306}
        priority
        unoptimized
      />
    </span>
  )
}
