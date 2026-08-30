'use client'

import { useEffect, useId, useState } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { primaryNavigation } from '@/data/navigation'
import { Brand } from '@/components/ui/Brand'
import styles from './layout.module.css'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const pathname = usePathname()
  const onHome = pathname === '/'
  const homeSectionHref = (href: string) => (onHome ? href : `/${href}`)

  useEffect(() => {
    if (!menuOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.headerInner}`}>
        <a className={styles.brandLink} href={onHome ? '#top' : '/'}>
          <Brand />
          <span className="srOnly">— voltar ao início</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Navegação principal">
          {primaryNavigation.map((item) => (
            <a key={item.href} href={homeSectionHref(item.href)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <a className={styles.headerCta} href="/comprar">
            Comprar K2 Tap
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobilePanel} id={menuId}>
          <nav className={styles.mobileNav} aria-label="Navegação mobile">
            <a className={styles.mobilePurchase} href="/comprar" onClick={() => setMenuOpen(false)}>
              Comprar K2 Tap
              <ArrowRight size={15} aria-hidden="true" />
            </a>
            {primaryNavigation.map((item) => (
              <a
                key={item.href}
                href={homeSectionHref(item.href)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            ))}
            <a
              className={styles.mobileCommercial}
              href={siteConfig.commercialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Conversar com o comercial
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
