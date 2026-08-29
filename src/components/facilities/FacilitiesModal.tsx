'use client'

import { useCallback, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { FacilityKind, ProjectConfig } from '@/types/project'
import { customerFacilities, facilityIcons } from '@/data/facilities'
import { useCopyToast } from '@/hooks/useCopyToast'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { Toast } from '@/components/feedback/Toast'
import { FacilitiesNavigation } from './FacilitiesNavigation'
import { LocationPanel } from './LocationPanel'
import { PixPanel } from './PixPanel'
import { ReviewPanel } from './ReviewPanel'
import { SocialPanel } from './SocialPanel'
import { StaffCallPanel } from './StaffCallPanel'
import { WifiPanel } from './WifiPanel'
import styles from './facilities.module.css'

/** Só o texto muda por facilidade: ícone e rótulo vêm de `data/facilities`. */
const facilityCopy = {
  wifi: {
    title: 'Conecte-se ao Wi-Fi',
    subtitle: 'Escaneie, copie ou conecte sem digitar.',
  },
  pix: {
    title: 'Pagamento rápido',
    subtitle: 'QR Code demonstrativo e chave fictícia em um só lugar.',
  },
  staff: {
    title: 'Chamar atendimento',
    subtitle: 'O chamado sai da mesa e chega no celular da equipe.',
  },
  social: {
    title: 'Redes sociais',
    subtitle: 'Canais oficiais reunidos para o cliente.',
  },
  location: {
    title: 'Como chegar',
    subtitle: 'Mapa, rota e compartilhamento do endereço.',
  },
  review: {
    title: 'Sua opinião',
    subtitle: 'Uma forma simples de ouvir quem acabou de usar.',
  },
} satisfies Record<FacilityKind, { title: string; subtitle: string }>

type FacilitiesModalProps = {
  project: ProjectConfig
  initialFacility: FacilityKind
  onClose: () => void
}

function listFacilities(project: ProjectConfig): FacilityKind[] {
  if (!project.staffCall) return customerFacilities
  // O atendimento entra logo depois do Pix, onde o cliente procura por ele.
  return ['wifi', 'pix', 'staff', 'social', 'location', 'review']
}

export function FacilitiesModal({ project, initialFacility, onClose }: FacilitiesModalProps) {
  const available = listFacilities(project)
  const [activeFacility, setActiveFacility] = useState(
    available.includes(initialFacility) ? initialFacility : 'wifi',
  )
  const modalRef = useRef<HTMLDivElement>(null)
  const { toast, dismiss, copy, notify } = useCopyToast()
  const meta = facilityCopy[activeFacility]
  const ActiveIcon = facilityIcons[activeFacility]

  useFocusTrap(modalRef, true, onClose)

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
          {activeFacility === 'wifi' && <WifiPanel project={project} onCopy={copy} />}
          {activeFacility === 'pix' && <PixPanel project={project} onCopy={copy} />}
          {activeFacility === 'staff' && project.staffCall && (
            <StaffCallPanel staffCall={project.staffCall} onCopy={copy} />
          )}
          {activeFacility === 'social' && <SocialPanel project={project} />}
          {activeFacility === 'location' && (
            <LocationPanel project={project} onCopy={copy} onNotify={notify} />
          )}
          {activeFacility === 'review' && <ReviewPanel />}
        </div>
      </div>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  )
}
