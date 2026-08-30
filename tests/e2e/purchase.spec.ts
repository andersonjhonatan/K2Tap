import { expect, test } from '@playwright/test'

const viewports = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]

test('apresenta produtos, preços e CTAs de compra corretos', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  await page.goto('/comprar')

  await expect(
    page.getByRole('heading', { name: 'Tecnologia que conecta seu negócio ao cliente.' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Cartão K2 Tap' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Expositor K2 Tap' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Combo K2 Tap' })).toBeVisible()

  for (const price of ['R$ 59,90', 'R$ 99,90', 'R$ 149,90']) {
    await expect(page.getByText(price, { exact: true }).first()).toBeVisible()
  }

  const purchaseButtons = [
    ['Quero meu Cartão por R$ 59,90 pelo WhatsApp', 'Cartão K2 Tap de R$ 59,90'],
    ['Quero meu Expositor por R$ 99,90 pelo WhatsApp', 'Expositor K2 Tap de R$ 99,90'],
    ['Quero o Combo por R$ 149,90 pelo WhatsApp', 'Combo K2 Tap de R$ 149,90'],
  ] as const

  for (const [label, message] of purchaseButtons) {
    const href = await page.getByRole('link', { name: label, exact: true }).first().getAttribute('href')
    expect(href).toContain('https://wa.me/')
    expect(decodeURIComponent(href ?? '')).toContain(message)
  }

  const faq = page.getByText('O K2 Tap precisa de bateria?', { exact: true })
  await faq.click()
  await expect(faq.locator('..')).toHaveAttribute('open', '')
  expect(consoleErrors).toEqual([])
})

test('não cria overflow nos breakpoints solicitados', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/comprar')

    const metrics = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      root: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }))

    expect.soft(metrics.body, `body em ${viewport.width}px`).toBeLessThanOrEqual(metrics.viewport)
    expect.soft(metrics.root, `root em ${viewport.width}px`).toBeLessThanOrEqual(metrics.viewport)
  }
})

test('exibe CTA móvel apenas durante a visualização do Combo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/comprar')

  const stickyCta = page.locator('main aside a')
  await expect(stickyCta).toBeHidden()
  await page.locator('#purchase-product-combo').scrollIntoViewIfNeeded()
  await expect(stickyCta).toBeVisible()
})

test('CTA da navegação da home leva para a página de compra', async ({ page }) => {
  await page.goto('/')
  const purchaseLink = page.getByRole('link', { name: 'Comprar K2 Tap', exact: true }).first()
  await expect(purchaseLink).toHaveAttribute('href', '/comprar')
})
