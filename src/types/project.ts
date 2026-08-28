export type ProjectId = 'restaurant' | 'barber' | 'store' | 'service'

export type FacilityKind = 'wifi' | 'pix' | 'social' | 'location' | 'review'

export type ProjectIcon =
  | 'badge-check'
  | 'briefcase'
  | 'calendar'
  | 'folder'
  | 'grid'
  | 'map-pin'
  | 'message-circle'
  | 'percent'
  | 'qr-code'
  | 'scissors'
  | 'shopping-bag'
  | 'sparkles'
  | 'star'
  | 'users'
  | 'utensils'
  | 'wifi'

export type ExperienceAction = {
  id: string
  label: string
  description: string
  icon: ProjectIcon
  facility?: FacilityKind
}

export type SocialLink = {
  network: 'Instagram' | 'WhatsApp' | 'TikTok'
  handle: string
  href: string
}

export type OpeningHour = {
  day: string
  hours: string
}

export type ProjectConfig = {
  id: ProjectId
  slug: string
  name: string
  tabDescription: string
  experience: {
    eyebrow: string
    headline: string
    description: string
    primaryCta: string
    artworkEyebrow: string
    artworkTitle: string
    artworkDescription: string
  }
  theme: {
    background: string
    foreground: string
    muted: string
    accent: string
    surface: string
    border: string
  }
  actions: ExperienceAction[]
  highlight: {
    eyebrow: string
    title: string
  }
  wifi: {
    ssid: string
    password: string
    security: 'WPA' | 'WEP' | 'nopass'
  }
  pix: {
    provider: 'demo'
    receiver: string
    key: string
    payload?: string
  }
  socials: SocialLink[]
  location: {
    address: string
    mapQuery: string
  }
  openingHours?: {
    summary: string
    period: string
    days: OpeningHour[]
  }
}
