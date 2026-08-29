import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ConciergeBell,
  FolderCheck,
  Grid2X2,
  MapPin,
  MessageCircle,
  Percent,
  QrCode,
  Scissors,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wifi,
} from 'lucide-react'
import type { ProjectIcon } from '@/types/project'

const icons = {
  'badge-check': BadgeCheck,
  bell: ConciergeBell,
  briefcase: BriefcaseBusiness,
  calendar: CalendarDays,
  folder: FolderCheck,
  grid: Grid2X2,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  percent: Percent,
  'qr-code': QrCode,
  scissors: Scissors,
  'shopping-bag': ShoppingBag,
  sparkles: Sparkles,
  star: Star,
  users: Users,
  utensils: Utensils,
  wifi: Wifi,
} satisfies Record<ProjectIcon, typeof Star>

export function ExperienceIcon({ name, size = 16 }: { name: ProjectIcon; size?: number }) {
  const Icon = icons[name]
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />
}
