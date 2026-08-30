'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { comboProduct, getPurchaseUrl } from '@/data/products'
import styles from './pricing.module.css'

export function MobileComboCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const comboCard = document.querySelector('#purchase-product-combo')
    if (!comboCard) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.18 },
    )

    observer.observe(comboCard)
    return () => observer.disconnect()
  }, [])

  return (
    <aside className={`${styles.mobileComboCta} ${visible ? styles.mobileComboCtaVisible : ''}`}>
      <a
        href={getPurchaseUrl(comboProduct)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Quero o Combo por ${comboProduct.priceLabel} pelo WhatsApp`}
      >
        <span>Quero o Combo</span>
        <strong>{comboProduct.priceLabel}</strong>
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </aside>
  )
}
