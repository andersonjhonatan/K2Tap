export type ProjectId = 'restaurant' | 'barber' | 'store' | 'service'

export type FacilityKind = 'wifi' | 'pix' | 'social' | 'location' | 'review' | 'staff'

export type ProjectIcon =
  | 'badge-check'
  | 'bell'
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

export type StaffCallReasonIcon = 'bell' | 'order' | 'drink' | 'bill' | 'help'

export type StaffCallReason = {
  /** Identificador estável, usado na fila e na URL do chamado. */
  id: string
  label: string
  icon: StaffCallReasonIcon
}

export type StaffCall = {
  /** Como a equipe é chamada na experiência: Garçom, Atendente, Recepção. */
  role: string
  /** Identificação do ponto de origem do chamado: 12, Balcão, Suíte 3. */
  table: string
  /** Rótulo legível do ponto de origem. */
  spot: string
  actionLabel: string
  actionDescription: string
  headline: string
  description: string
  /** Motivos oferecidos ao cliente antes de confirmar o chamado. */
  reasons: StaffCallReason[]
  /** Rota da tela que o cliente enxerga ao encostar o celular na peça da mesa. */
  customerPath: string
  /** Rota do painel que chega no celular de quem atende. */
  staffPath: string
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
  staffCall?: StaffCall
  openingHours?: {
    summary: string
    period: string
    days: OpeningHour[]
  }
}
