import { expect, test } from '@playwright/test'

const viewports = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test(`captura visual da compra ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/comprar')
    await expect(page.locator('main')).toBeVisible()

    const sections = page.locator('main section')
    for (let index = 0; index < (await sections.count()); index += 1) {
      await sections.nth(index).scrollIntoViewIfNeeded()
      await page.waitForTimeout(120)
    }

    await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('body > header')
      if (header) header.style.position = 'relative'
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(500)

    await page.screenshot({
      path: `artifacts/final/comprar-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })
  })
}
