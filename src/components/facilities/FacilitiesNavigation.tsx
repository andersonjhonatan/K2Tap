import { Heart, MapPin, QrCode, Star, Wifi } from 'lucide-react'
import type { FacilityKind } from '@/types/project'
import styles from './facilities.module.css'

const items = [
  { id: 'wifi' as const, label: 'Wi-Fi', Icon: Wifi },
  { id: 'pix' as const, label: 'Pix', Icon: QrCode },
  { id: 'social' as const, label: 'Redes', Icon: Heart },
  { id: 'location' as const, label: 'Mapa', Icon: MapPin },
  { id: 'review' as const, label: 'Opinião', Icon: Star },
]

type FacilitiesNavigationProps = {
  active: FacilityKind
  onChange: (facility: FacilityKind) => void
}

export function FacilitiesNavigation({ active, onChange }: FacilitiesNavigationProps) {
  return (
    <div className={styles.navigation} role="tablist" aria-label="Facilidades da experiência">
      {items.map(({ id, label, Icon }) => (
        <button
          className={active === id ? styles.activeTab : ''}
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          aria-controls="facility-panel"
          tabIndex={active === id ? 0 : -1}
          onClick={() => onChange(id)}
        >
          <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
