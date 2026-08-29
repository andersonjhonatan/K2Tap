import { Camera, MessageCircle, Music2 } from 'lucide-react'
import type { SocialLink } from '@/types/project'

const icons = {
  Instagram: Camera,
  WhatsApp: MessageCircle,
  TikTok: Music2,
} satisfies Record<SocialLink['network'], typeof Camera>

export function SocialIcon({
  network,
  size = 16,
}: {
  network: SocialLink['network']
  size?: number
}) {
  const Icon = icons[network]
  return <Icon size={size} aria-hidden="true" />
}
