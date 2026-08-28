import { expect, test } from '@playwright/test'

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test(`captura visual ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()

    for (const selector of ['#como', '#experiencias', '#possibilidades', '#contato', 'footer']) {
      await page.locator(selector).scrollIntoViewIfNeeded()
      await page.waitForTimeout(180)
    }
    await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('header')
      if (header) header.style.position = 'relative'
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(900)

    await page.screenshot({
      path: `artifacts/final/k2tap-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })
  })
}
