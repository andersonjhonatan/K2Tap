import { primaryNavigation } from '@/data/navigation'
import styles from './layout.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.footerInner}`}>
        <div className={styles.footerMark} aria-hidden="true">
          K2
        </div>
        <div className={styles.footerLogo}>
          K2 <b>TAP</b>
        </div>
        <p className={styles.footerTagline}>
          Uma solução K2 Tech para transformar um toque físico em uma experiência digital simples,
          bonita e útil.
        </p>

        <nav className={styles.footerNav} aria-label="Navegação do rodapé">
          {primaryNavigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.footerDivider} />
        <div className={styles.footerBottom}>
          <span>© 2026 K2 Tech</span>
          <span className={styles.separator} />
          <span>K2 Tap</span>
          <span className={styles.separator} />
          <span>Conexões físicas. Experiências digitais.</span>
        </div>
      </div>
    </footer>
  )
}
