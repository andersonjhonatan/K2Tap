import { siteConfig } from '@/config/site'

export type PurchaseProductId = 'card' | 'display' | 'combo'

export type PurchaseProduct = {
  id: PurchaseProductId
  name: string
  shortName: string
  price: number
  priceLabel: string
  description: string
  image: {
    src: string
    width: number
    height: number
    alt: string
  }
  features: readonly string[]
  ctaLabel: string
  purchaseMessage: string
  featured?: boolean
  badge?: string
}

export const products: readonly PurchaseProduct[] = [
  {
    id: 'card',
    name: 'Cartão K2 Tap',
    shortName: 'Cartão',
    price: 59.9,
    priceLabel: 'R$ 59,90',
    description: 'Sua conexão K2 Tap sempre à mão, em um formato compacto e sem bateria.',
    image: {
      src: '/images/k2tap-card.png',
      width: 1122,
      height: 1402,
      alt: 'Cartão NFC K2 Tap preto com acabamento azul iluminado',
    },
    features: [
      'Tecnologia NFC',
      'Aproximação pelo celular',
      'Sem bateria ou recarga',
      'Personalizável',
      'Compacto e fácil de transportar',
      'Acesso rápido ao perfil K2 Tap',
    ],
    ctaLabel: 'Quero meu Cartão',
    purchaseMessage: 'Olá! Tenho interesse no Cartão K2 Tap de R$ 59,90.',
  },
  {
    id: 'display',
    name: 'Expositor K2 Tap',
    shortName: 'Expositor',
    price: 99.9,
    priceLabel: 'R$ 99,90',
    description:
      'Uma presença profissional para balcões, recepções, mesas e pontos de atendimento.',
    image: {
      src: '/images/k2tap-display.png',
      width: 1122,
      height: 1402,
      alt: 'Expositor de mesa K2 Tap em acrílico com NFC e QR Code',
    },
    features: [
      'Expositor de mesa',
      'Tecnologia NFC',
      'QR Code',
      'Fácil acesso pelo celular',
      'Ideal para balcões, recepções e mesas',
      'Personalização com a identidade do negócio',
    ],
    ctaLabel: 'Quero meu Expositor',
    purchaseMessage: 'Olá! Tenho interesse no Expositor K2 Tap de R$ 99,90.',
  },
  {
    id: 'combo',
    name: 'Combo K2 Tap',
    shortName: 'Combo',
    price: 149.9,
    priceLabel: 'R$ 149,90',
    description: 'A experiência completa: mobilidade para você e presença no seu ponto físico.',
    image: {
      src: '/images/k2tap-combo.png',
      width: 1335,
      height: 1178,
      alt: 'Combo K2 Tap com cartão NFC e expositor de acrílico',
    },
    features: [
      '1 Cartão K2 Tap',
      '1 Expositor K2 Tap',
      'NFC + QR Code',
      'Experiência completa',
      'Uso pessoal e no ponto físico',
      'Identidade visual integrada',
    ],
    ctaLabel: 'Quero o Combo',
    purchaseMessage: 'Olá! Tenho interesse no Combo K2 Tap de R$ 149,90.',
    featured: true,
    badge: 'Melhor escolha',
  },
] as const

export const comboProduct = products[2]

export function getPurchaseUrl(product: Pick<PurchaseProduct, 'purchaseMessage'>) {
  const separator = siteConfig.commercialUrl.includes('?') ? '&' : '?'
  return `${siteConfig.commercialUrl}${separator}text=${encodeURIComponent(product.purchaseMessage)}`
}

export const comparisonRows = [
  { label: 'NFC', card: true, display: true, combo: true },
  { label: 'QR Code', card: false, display: true, combo: true },
  { label: 'Portátil', card: true, display: false, combo: true },
  { label: 'Uso em balcão', card: false, display: true, combo: true },
  { label: 'Kit completo', card: false, display: false, combo: true },
] as const
