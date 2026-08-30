import { describe, expect, it } from 'vitest'
import { getPurchaseUrl, products } from '@/data/products'

describe('catálogo de compra K2 Tap', () => {
  it('mantém os três preços de aquisição corretos', () => {
    expect(products.map((product) => [product.id, product.priceLabel])).toEqual([
      ['card', 'R$ 59,90'],
      ['display', 'R$ 99,90'],
      ['combo', 'R$ 149,90'],
    ])
  })

  it('gera mensagens específicas para compra pelo WhatsApp', () => {
    for (const product of products) {
      const url = getPurchaseUrl(product)
      expect(url).toContain('https://wa.me/')
      expect(decodeURIComponent(url)).toContain(product.purchaseMessage)
    }
  })
})
