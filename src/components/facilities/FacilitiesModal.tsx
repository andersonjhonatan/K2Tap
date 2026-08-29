'use client'

import { useCallback, useRef, useState } from 'react'
import { ConciergeBell, Heart, MapPin, QrCode, Star, Wifi, X } from 'lucide-react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { useClipboard } from '@/hooks/useClipboard'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/feedback/Toast'
import { FacilitiesNavigation } from './FacilitiesNavigation'
import { LocationPanel } from './LocationPanel'
import { PixPanel } from './PixPanel'
import { ReviewPanel } from './ReviewPanel'
import { SocialPanel } from './SocialPanel'
import { StaffCallPanel } from './StaffCallPanel'
import { WifiPanel } from './WifiPanel'
import type { CopyFeedback } from './types'
import styles from './facilities.module.css'

const facilityMeta = {
  wifi: {
    title: 'Conecte-se ao Wi-Fi',
    subtitle: 'Escaneie, copie ou conecte sem digitar.',
    Icon: Wifi,
  },
  pix: {
    title: 'Pagamento rápido',
    subtitle: 'QR Code demonstrativo e chave fictícia em um só lugar.',
    Icon: QrCode,
  },
  staff: {
    title: 'Chamar atendimento',
    subtitle: 'O chamado sai da mesa e chega no celular da equipe.',
    Icon: ConciergeBell,
  },
  social: {
    title: 'Redes sociais',
    subtitle: 'Canais oficiais reunidos para o cliente.',
    Icon: Heart,
  },
  location: {
    title: 'Como chegar',
    subtitle: 'Mapa, rota e compartilhamento do endereço.',
    Icon: MapPin,
  },
  review: {
    title: 'Sua opinião',
    subtitle: 'Uma forma simples de ouvir quem acabou de usar.',
    Icon: Star,
  },
} satisfies Record<FacilityKind, { title: string; subtitle: string; Icon: typeof Wifi }>

type FacilitiesModalProps = {
  project: ProjectConfig
  initialFacility: FacilityKind
  onClose: () => void
}

const baseFacilities: FacilityKind[] = ['wifi', 'pix', 'social', 'location', 'review']

function listFacilities(project: ProjectConfig): FacilityKind[] {
  return project.staffCall ? [...baseFacilities, 'staff'] : baseFacilities
}

export function FacilitiesModal({ project, initialFacility, onClose }: FacilitiesModalProps) {
  const available = listFacilities(project)
  const [activeFacility, setActiveFacility] = useState(
    available.includes(initialFacility) ? initialFacility : 'wifi',
  )
  const modalRef = useRef<HTMLDivElement>(null)
  const copy = useClipboard()
  const { toast, showToast, dismiss } = useToast()
  const meta = facilityMeta[activeFacility]
  const ActiveIcon = meta.Icon

  useFocusTrap(modalRef, true, onClose)

  const handleCopy = useCallback(
    async (value: string, feedback?: CopyFeedback) => {
      const copied = await copy(value)
      showToast(
        copied
          ? {
              title: feedback?.title ?? 'Copiado com sucesso',
              description:
                feedback?.description ?? 'O conteúdo já está na sua área de transferência.',
              variant: 'success',
            }
          : {
              title: 'Não foi possível copiar',
              description: 'Toque e segure o conteúdo para copiar manualmente.',
              variant: 'error',
            },
      )
      return copied
    },
    [copy, showToast],
  )

  const notify = useCallback(
    (title: string, description: string) => {
      showToast({ title, description, variant: 'success' })
    },
    [showToast],
  )

  const changeFacility = useCallback((facility: FacilityKind) => {
    setActiveFacility(facility)
    requestAnimationFrame(() => {
      const modal = modalRef.current
      if (!modal) return
      if (typeof modal.scrollTo === 'function') {
        modal.scrollTo({ top: 0, behavior: 'instant' })
      } else {
        modal.scrollTop = 0
      }
    })
  }, [])

  return (
    <div className={styles.modal}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div
        className={styles.dialog}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="facility-title"
        aria-describedby="facility-subtitle"
      >
        <header className={styles.modalHeader}>
          <div className={styles.headerIcon}>
            <ActiveIcon size={16} aria-hidden="true" />
          </div>
          <div>
            <small>FACILIDADES K2 TAP</small>
            <h3 id="facility-title">{meta.title}</h3>
            <span id="facility-subtitle">{meta.subtitle}</span>
          </div>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </header>

        <FacilitiesNavigation
          active={activeFacility}
          available={available}
          staffLabel={project.staffCall?.role}
          onChange={changeFacility}
        />

        <div className={styles.modalBody} id="facility-panel" role="tabpanel">
          {activeFacility === 'wifi' && <WifiPanel project={project} onCopy={handleCopy} />}
          {activeFacility === 'pix' && <PixPanel project={project} onCopy={handleCopy} />}
          {activeFacility === 'staff' && project.staffCall && (
            <StaffCallPanel staffCall={project.staffCall} onCopy={handleCopy} />
          )}
          {activeFacility === 'social' && <SocialPanel project={project} />}
          {activeFacility === 'location' && (
            <LocationPanel project={project} onCopy={handleCopy} onNotify={notify} />
          )}
          {activeFacility === 'review' && <ReviewPanel />}
        </div>
      </div>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  )
}
