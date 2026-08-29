'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Heart, MapPin, QrCode, Star, Wifi, X } from 'lucide-react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { DemoFacilityPanel } from './DemoFacilityPanel'
import styles from './demo.module.css'

export const facilityMeta = {
  wifi: {
    label: 'Wi-Fi',
    title: 'Conecte sem pedir a senha.',
    subtitle: 'Escaneie o QR Code ou copie os dados da rede.',
    Icon: Wifi,
  },
  pix: {
    label: 'Pix',
    title: 'Aponte a câmera e pague.',
    subtitle: 'QR Code e chave prontos, sem erro de digitação.',
    Icon: QrCode,
  },
  social: {
    label: 'Redes',
    title: 'Todos os canais em um lugar só.',
    subtitle: 'Instagram, WhatsApp e TikTok da casa.',
    Icon: Heart,
  },
  location: {
    label: 'Mapa',
    title: 'Como chegar.',
    subtitle: 'Veja no mapa, abra a rota ou mande para alguém.',
    Icon: MapPin,
  },
  review: {
    label: 'Opinião',
    title: 'Como foi sua experiência?',
    subtitle: 'Um minuto para contar o que você achou.',
    Icon: Star,
  },
} satisfies Record<
  Exclude<FacilityKind, 'staff'>,
  { label: string; title: string; subtitle: string; Icon: typeof Wifi }
>

export type DemoFacility = keyof typeof facilityMeta

export const demoFacilities = Object.keys(facilityMeta) as DemoFacility[]

type DemoModalProps = {
  facility: DemoFacility
  project: ProjectConfig
  onSelect: (facility: DemoFacility) => void
  onClose: () => void
  onCopy: (value: string, title?: string, description?: string) => Promise<boolean>
  onNotify: (title: string, description: string) => void
}

export function DemoModal({
  facility,
  project,
  onSelect,
  onClose,
  onCopy,
  onNotify,
}: DemoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const meta = facilityMeta[facility]
  const ActiveIcon = meta.Icon

  useFocusTrap(dialogRef, true, onClose)

  // A página atrás não deve rolar junto com o modal aberto.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const select = useCallback(
    (next: DemoFacility) => {
      onSelect(next)
      const body = bodyRef.current
      if (body && typeof body.scrollTo === 'function') body.scrollTo({ top: 0 })
    },
    [onSelect],
  )

  return (
    <div className={styles.modal}>
      {/* Fechar tocando fora. O botão do cabeçalho é o caminho anunciado
          para leitores de tela, então aqui a camada fica fora da árvore. */}
      <button
        className={styles.modalBackdrop}
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        className={styles.dialog}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-facility-title"
      >
        <span className={styles.dialogGrab} aria-hidden="true" />
        <header className={styles.dialogHeader}>
          <span className={styles.dialogIcon}>
            <ActiveIcon size={19} aria-hidden="true" />
          </span>
          <div>
            <small>{project.name}</small>
            <h2 id="demo-facility-title">{meta.title}</h2>
            <span>{meta.subtitle}</span>
          </div>
          <button
            className={styles.dialogClose}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={17} />
          </button>
        </header>

        <div className={styles.dialogTabs} role="tablist" aria-label="Facilidades">
          {demoFacilities.map((item) => {
            const { label, Icon } = facilityMeta[item]
            const active = item === facility
            return (
              <button
                className={active ? styles.dialogTabOn : ''}
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => select(item)}
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        <div className={styles.dialogBody} ref={bodyRef}>
          <DemoFacilityPanel
            key={facility}
            facility={facility}
            project={project}
            onCopy={onCopy}
            onNotify={onNotify}
          />
        </div>
      </div>
    </div>
  )
}
