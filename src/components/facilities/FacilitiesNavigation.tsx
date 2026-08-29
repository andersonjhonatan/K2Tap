import type { FacilityKind } from '@/types/project'
import { facilityIcons, facilityLabels } from '@/data/facilities'
import styles from './facilities.module.css'

type FacilitiesNavigationProps = {
  active: FacilityKind
  available: FacilityKind[]
  /** Rótulo da aba de atendimento, que muda com o papel da equipe. */
  staffLabel?: string
  onChange: (facility: FacilityKind) => void
}

export function FacilitiesNavigation({
  active,
  available,
  staffLabel,
  onChange,
}: FacilitiesNavigationProps) {
  return (
    <div className={styles.navigation} role="tablist" aria-label="Facilidades da experiência">
      {available.map((facility) => {
        const Icon = facilityIcons[facility]
        const label =
          facility === 'staff' ? (staffLabel ?? facilityLabels.staff) : facilityLabels[facility]
        const isActive = active === facility

        return (
          <button
            className={isActive ? styles.activeTab : ''}
            key={facility}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="facility-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(facility)}
          >
            <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
