import { expect, test } from '@playwright/test'

const sizes = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
]

test('não cria overflow e mantém modal contido nos breakpoints críticos', async ({ page }) => {
  for (const size of sizes) {
    await page.setViewportSize(size)
    await page.goto('/')

    const pageMetrics = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      root: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }))
    expect
      .soft(pageMetrics.body, `body em ${size.width}px`)
      .toBeLessThanOrEqual(pageMetrics.viewport)
    expect
      .soft(pageMetrics.root, `root em ${size.width}px`)
      .toBeLessThanOrEqual(pageMetrics.viewport)

    await page.locator('#experiencias').scrollIntoViewIfNeeded()
    const phone = page.locator('[aria-label^="Prévia mobile da experiência"]')
    await expect(phone).toBeVisible()
    const initialPhoneBox = await phone.boundingBox()
    expect(initialPhoneBox, `telefone em ${size.width}px`).not.toBeNull()
    if (initialPhoneBox) {
      expect.soft(initialPhoneBox.x, `borda esquerda em ${size.width}px`).toBeGreaterThanOrEqual(0)
      expect
        .soft(initialPhoneBox.x + initialPhoneBox.width, `borda direita em ${size.width}px`)
        .toBeLessThanOrEqual(size.width)
    }

    await page.getByRole('button', { name: /Wi-Fi Conecte/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Conecte-se ao Wi-Fi' })
    await expect(dialog).toBeVisible()
    const { phoneBox, dialogBox } = await page.evaluate(() => {
      const phoneElement = document.querySelector<HTMLElement>(
        '[aria-label^="Prévia mobile da experiência"]',
      )
      const dialogElement = document.querySelector<HTMLElement>('[role="dialog"]')
      const toBox = (element: HTMLElement | null) => {
        if (!element) return null
        const rect = element.getBoundingClientRect()
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      }
      return { phoneBox: toBox(phoneElement), dialogBox: toBox(dialogElement) }
    })
    expect(dialogBox, `modal em ${size.width}px`).not.toBeNull()
    if (phoneBox && dialogBox) {
      expect
        .soft(dialogBox.x, `modal à esquerda em ${size.width}px`)
        .toBeGreaterThanOrEqual(phoneBox.x)
      expect
        .soft(dialogBox.y, `modal no topo em ${size.width}px`)
        .toBeGreaterThanOrEqual(phoneBox.y)
      expect
        .soft(dialogBox.x + dialogBox.width, `modal à direita em ${size.width}px`)
        .toBeLessThanOrEqual(phoneBox.x + phoneBox.width)
      expect
        .soft(dialogBox.y + dialogBox.height, `modal na base em ${size.width}px`)
        .toBeLessThanOrEqual(phoneBox.y + phoneBox.height)
    }
    await page.getByRole('button', { name: 'Fechar' }).click()
  }
})
