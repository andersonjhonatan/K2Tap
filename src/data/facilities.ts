import { ConciergeBell, Heart, MapPin, QrCode, Star, Wifi } from 'lucide-react'
import type { FacilityKind } from '@/types/project'

/** Ícone e rótulo curto de cada facilidade, iguais em toda a aplicação. */
export const facilityIcons = {
  wifi: Wifi,
  pix: QrCode,
  social: Heart,
  location: MapPin,
  review: Star,
  staff: ConciergeBell,
} satisfies Record<FacilityKind, typeof Wifi>

export const facilityLabels = {
  wifi: 'Wi-Fi',
  pix: 'Pix',
  social: 'Redes',
  location: 'Mapa',
  review: 'Opinião',
  staff: 'Atendimento',
} satisfies Record<FacilityKind, string>

/** Facilidade voltada ao cliente: `staff` depende de o projeto ter equipe. */
export type CustomerFacility = Exclude<FacilityKind, 'staff'>

export const customerFacilities: CustomerFacility[] = [
  'wifi',
  'pix',
  'social',
  'location',
  'review',
]
