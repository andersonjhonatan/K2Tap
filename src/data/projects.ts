import type { OpeningHour, ProjectConfig } from '@/types/project'

const restaurantHours: OpeningHour[] = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
].map((day) => ({ day, hours: '08:00 às 22:00' }))

const demoSocials = (slug: string, handle: string, phone: string) => [
  {
    network: 'Instagram' as const,
    handle: `@${handle}`,
    href: `https://example.com/demo/${slug}/instagram`,
  },
  {
    network: 'WhatsApp' as const,
    handle: phone,
    href: `https://example.com/demo/${slug}/whatsapp`,
  },
  {
    network: 'TikTok' as const,
    handle: `@${handle}`,
    href: `https://example.com/demo/${slug}/tiktok`,
  },
]

export const projects = [
  {
    id: 'restaurant',
    slug: 'k2-restaurante',
    name: 'K2 Restaurante',
    tabDescription: 'Cardápio • pedido • experiência',
    experience: {
      eyebrow: 'K2 RESTAURANTE • BEM-VINDO',
      headline: 'O sabor da casa, a um toque.',
      description:
        'Cardápio, pedido, Wi-Fi, pagamento e tudo o que você precisa sem procurar link nenhum.',
      primaryCta: 'Ver cardápio completo',
      artworkEyebrow: 'WEB DESIGN • MENU DA CASA',
      artworkTitle: 'Sabores que começam pelo olhar.',
      artworkDescription: 'Uma composição editorial para dar personalidade ao projeto.',
    },
    theme: {
      background: '#f3e8d8',
      foreground: '#3c2118',
      muted: '#74594d',
      accent: '#b85232',
      surface: '#fffaf2',
      border: '#dfcbb8',
    },
    actions: [
      {
        id: 'menu',
        label: 'Cardápio',
        description: 'Pratos, bebidas e sobremesas.',
        icon: 'utensils',
      },
      {
        id: 'order',
        label: 'Pedir',
        description: 'Comece seu pedido agora.',
        icon: 'shopping-bag',
      },
      {
        id: 'directions',
        label: 'Como chegar',
        description: 'Mapa, rota e compartilhamento.',
        icon: 'map-pin',
        facility: 'location',
      },
      {
        id: 'rate',
        label: 'Avaliar',
        description: 'Conte como foi sua experiência.',
        icon: 'star',
        facility: 'review',
      },
      {
        id: 'wifi',
        label: 'Wi-Fi',
        description: 'Conecte pelo QR Code.',
        icon: 'wifi',
        facility: 'wifi',
      },
      {
        id: 'pix',
        label: 'Pague Fácil',
        description: 'Pagamento via Pix.',
        icon: 'qr-code',
        facility: 'pix',
      },
    ],
    highlight: {
      eyebrow: 'DESTAQUE DE HOJE',
      title: 'Frango da brasa + acompanhamentos',
    },
    wifi: {
      ssid: 'K2 Restaurante',
      password: 'K2Restaurante@2026',
      security: 'WPA',
    },
    pix: {
      provider: 'demo',
      receiver: 'K2 Restaurante — demonstração',
      key: 'financeiro@k2restaurante.demo',
    },
    socials: demoSocials('k2-restaurante', 'k2restaurante', '(81) 00000-1200'),
    location: {
      address: 'Av. Boa Viagem, 1200 — Recife, PE',
      mapQuery: 'Boa Viagem Recife PE',
    },
    staffCall: {
      role: 'Garçom',
      table: '12',
      spot: 'Mesa 12',
      actionLabel: 'Chamar garçom',
      actionDescription: 'Atendimento na mesa em um toque.',
      headline: 'Chame o garçom sem levantar a mão.',
      description:
        'O cliente encosta o celular na peça da mesa, escolhe o motivo e confirma. O chamado abre na hora no painel de quem está atendendo.',
      reasons: ['Fazer o pedido', 'Pedir a conta', 'Repor bebida', 'Tirar uma dúvida'],
      customerPath: '/demo/mesa/12',
      staffPath: '/garcom',
    },
    openingHours: {
      summary: 'Aberto todos os dias',
      period: '08:00 às 22:00',
      days: restaurantHours,
    },
  },
  {
    id: 'barber',
    slug: 'k2-barbearia',
    name: 'K2 Barbearia',
    tabDescription: 'Serviços • agenda • equipe',
    experience: {
      eyebrow: 'K2 BARBER • AGENDE ONLINE',
      headline: 'Seu próximo corte começa aqui.',
      description: 'Escolha o serviço, conheça a equipe e marque o melhor horário.',
      primaryCta: 'Agendar horário',
      artworkEyebrow: 'WEB DESIGN • SIGNATURE CUT',
      artworkTitle: 'Estilo forte antes do primeiro corte.',
      artworkDescription: 'Contraste, tipografia e ritmo visual próprios da barbearia.',
    },
    theme: {
      background: '#111418',
      foreground: '#f3f0e8',
      muted: '#a9afb7',
      accent: '#c9a66b',
      surface: '#1a1e23',
      border: '#303740',
    },
    actions: [
      {
        id: 'schedule',
        label: 'Agenda',
        description: 'Veja horários disponíveis.',
        icon: 'calendar',
      },
      {
        id: 'services',
        label: 'Serviços',
        description: 'Corte, barba e combos.',
        icon: 'scissors',
      },
      { id: 'team', label: 'Equipe', description: 'Escolha seu profissional.', icon: 'users' },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        description: 'Fale com a barbearia.',
        icon: 'message-circle',
      },
    ],
    highlight: { eyebrow: 'PRÓXIMO HORÁRIO', title: 'Hoje • 18:30 com Lucas' },
    wifi: { ssid: 'K2 Barber', password: 'CorteK2@2026', security: 'WPA' },
    pix: {
      provider: 'demo',
      receiver: 'K2 Barbearia — demonstração',
      key: 'pagamentos@k2barber.demo',
    },
    socials: demoSocials('k2-barbearia', 'k2barber', '(81) 00000-2200'),
    location: {
      address: 'Praça de Casa Forte, 200 — Recife, PE',
      mapQuery: 'Casa Forte Recife PE',
    },
  },
  {
    id: 'store',
    slug: 'k2-loja',
    name: 'K2 Loja',
    tabDescription: 'Catálogo • coleção • compra',
    experience: {
      eyebrow: 'K2 STORE • NOVA COLEÇÃO',
      headline: 'Sua vitrine continua no celular.',
      description: 'Veja lançamentos, catálogo, promoções e fale com a loja.',
      primaryCta: 'Ver catálogo',
      artworkEyebrow: 'WEB DESIGN • NOVA COLEÇÃO',
      artworkTitle: 'Editorial, leve e feito para vender.',
      artworkDescription: 'Uma vitrine digital com linguagem de campanha.',
    },
    theme: {
      background: '#f7eef7',
      foreground: '#302034',
      muted: '#725f75',
      accent: '#a63f83',
      surface: '#ffffff',
      border: '#eadff0',
    },
    actions: [
      { id: 'catalog', label: 'Catálogo', description: 'Produtos e categorias.', icon: 'grid' },
      { id: 'new', label: 'Novidades', description: 'O que acabou de chegar.', icon: 'sparkles' },
      { id: 'offers', label: 'Ofertas', description: 'Condições especiais.', icon: 'percent' },
      {
        id: 'support',
        label: 'Atendimento',
        description: 'Fale com a equipe.',
        icon: 'message-circle',
      },
    ],
    highlight: { eyebrow: 'COLEÇÃO EM DESTAQUE', title: 'Essenciais • edição 26' },
    wifi: { ssid: 'K2 Store', password: 'VitrineK2@2026', security: 'WPA' },
    pix: {
      provider: 'demo',
      receiver: 'K2 Loja — demonstração',
      key: 'pagamentos@k2store.demo',
    },
    socials: demoSocials('k2-loja', 'k2store', '(81) 00000-3200'),
    location: {
      address: 'Rua Padre Carapuceiro, 777 — Recife, PE',
      mapQuery: 'Shopping Recife PE',
    },
  },
  {
    id: 'service',
    slug: 'k2-servico',
    name: 'K2 Serviço',
    tabDescription: 'Soluções • confiança • orçamento',
    experience: {
      eyebrow: 'K2 SERVIÇO • ATENDIMENTO',
      headline: 'Explique o que precisa. A gente cuida do caminho.',
      description: 'Serviços, projetos, avaliações e orçamento em poucos toques.',
      primaryCta: 'Pedir orçamento',
      artworkEyebrow: 'WEB DESIGN • SOLUÇÃO PROFISSIONAL',
      artworkTitle: 'Clareza visual que transmite confiança.',
      artworkDescription: 'Geometria, organização e hierarquia para serviços.',
    },
    theme: {
      background: '#eaf5f4',
      foreground: '#113b3a',
      muted: '#567674',
      accent: '#16857f',
      surface: '#f8fffe',
      border: '#cfe7e4',
    },
    actions: [
      {
        id: 'services',
        label: 'Serviços',
        description: 'Veja o que atendemos.',
        icon: 'badge-check',
      },
      {
        id: 'projects',
        label: 'Projetos',
        description: 'Conheça trabalhos recentes.',
        icon: 'folder',
      },
      {
        id: 'ratings',
        label: 'Avaliações',
        description: 'Leia experiências de clientes.',
        icon: 'star',
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        description: 'Comece a conversa.',
        icon: 'message-circle',
      },
    ],
    highlight: { eyebrow: 'ATENDIMENTO RÁPIDO', title: 'Solicite uma visita técnica' },
    wifi: { ssid: 'K2 Serviços', password: 'ConectaK2@2026', security: 'WPA' },
    pix: {
      provider: 'demo',
      receiver: 'K2 Serviço — demonstração',
      key: 'financeiro@k2servico.demo',
    },
    socials: demoSocials('k2-servico', 'k2servico', '(81) 00000-4200'),
    location: {
      address: 'Rua Jornalista Trajano Chacon, 100 — Recife, PE',
      mapQuery: 'Ilha do Leite Recife PE',
    },
  },
] satisfies ProjectConfig[]

export const defaultProject = projects[0]

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

/** Projeto usado pelas rotas de mesa e pelo painel da equipe. */
export const tableProject = projects.find((project) => project.staffCall)
