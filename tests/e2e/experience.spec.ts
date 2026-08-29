import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

test('fluxo completo da demonstração K2 Tap', async ({ page }) => {
  const captureModal = async (path: string) => {
    await page.locator('body > header').evaluate((header) => {
      Object.assign(header.style, { position: 'fixed', inset: '0 0 auto', width: '100%' })
    })
    await page
      .locator('[aria-label^="Prévia mobile da experiência"]')
      .evaluate((element) => element.scrollIntoView({ block: 'center' }))
    await page.waitForTimeout(120)
    await page.screenshot({ path })
  }

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Encoste/ })).toBeVisible()

  await page.locator('#como').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /Reproduzir demonstração/ }).click()
  await expect(page.getByText('Aproxime o celular da K2 Tap.')).toBeVisible()

  await page.locator('#experiencias').scrollIntoViewIfNeeded()
  await expect(page.getByText('O sabor da casa, a um toque.')).toBeVisible()

  await page.getByRole('button', { name: /Wi-Fi Conecte/ }).click()
  await expect(page.getByRole('dialog', { name: 'Conecte-se ao Wi-Fi' })).toBeVisible()
  await expect(page.getByRole('img', { name: /QR Code da rede Wi-Fi/ })).toBeVisible()
  await page.getByRole('button', { name: 'Copiar senha do Wi-Fi' }).click()
  await expect(page.getByText('Copiado com sucesso')).toBeVisible()
  await captureModal('artifacts/final/modal-wifi-390x844.png')
  await page.getByRole('button', { name: 'Fechar aviso' }).click()

  await page.getByRole('tab', { name: 'Pix' }).click()
  await expect(page.getByRole('img', { name: /QR Code Pix demonstrativo/ })).toBeVisible()
  await captureModal('artifacts/final/modal-pix-390x844.png')

  await page.getByRole('tab', { name: 'Redes' }).click()
  await expect(page.getByRole('link', { name: /Instagram/ })).toBeVisible()
  await captureModal('artifacts/final/modal-redes-390x844.png')

  await page.getByRole('tab', { name: 'Mapa' }).click()
  await expect(page.getByTitle('Mapa de K2 Restaurante')).toBeVisible()
  await page.getByRole('button', { name: /Compartilhar/ }).click()
  await expect(page.getByText('Localização copiada', { exact: true })).toBeVisible()
  await captureModal('artifacts/final/modal-mapa-390x844.png')
  await page.getByRole('button', { name: 'Fechar aviso' }).click()

  await page.getByRole('tab', { name: 'Opinião' }).click()
  await page.getByRole('radio', { name: '5 estrelas' }).click()
  await page.getByPlaceholder(/Conte em poucas palavras/).fill('Experiência excelente.')
  await page.getByRole('button', { name: /Enviar opinião/ }).click()
  await expect(page.getByText('Obrigado pela sua opinião.')).toBeVisible()
  await captureModal('artifacts/final/modal-opiniao-390x844.png')
  await page.getByRole('button', { name: 'Fechar' }).click()

  await page.getByRole('button', { name: /PRECISA DE ALGUMA COISA/ }).click()
  await expect(page.getByRole('dialog', { name: 'Chamar atendimento' })).toBeVisible()
  await page.getByRole('button', { name: 'Chamar garçom', exact: true }).click()
  await expect(page.getByText(/Garçom a caminho da mesa 12/)).toBeVisible()
  const callLinks = page.getByRole('link', { name: /Abrir link/ })
  await expect(callLinks).toHaveCount(2)
  await expect(callLinks.first()).toHaveAttribute('href', /\/demo\/mesa\/12/)
  await expect(callLinks.last()).toHaveAttribute('href', /\/garcom/)
  await captureModal('artifacts/final/modal-garcom-390x844.png')
  await page.getByRole('button', { name: 'Fechar' }).click()

  await page.getByRole('link', { name: /Veja como fica na sua empresa/ }).click()
  await page.waitForURL('**/demo/k2-restaurante')
  await expect(
    page.getByRole('heading', { level: 1, name: 'O sabor da casa, a um toque.' }),
  ).toBeVisible()
  await expect(page.getByRole('img', { name: /QR Code/ })).toBeHidden()
  await page.screenshot({ path: 'artifacts/final/demo-restaurante-390x844.png' })

  await page.getByRole('button', { name: /Wi-Fi Conecte pelo QR Code/ }).click()
  const facilityDialog = page.getByRole('dialog')
  await expect(facilityDialog).toBeVisible()
  await expect(facilityDialog.getByRole('img', { name: /QR Code da rede Wi-Fi/ })).toBeVisible()
  await facilityDialog.getByRole('tab', { name: 'Pix' }).click()
  await expect(facilityDialog.getByRole('img', { name: /QR Code Pix/ })).toBeVisible()
  await page.screenshot({ path: 'artifacts/final/demo-modal-390x844.png' })
  await facilityDialog.getByRole('button', { name: 'Fechar' }).click()
  await expect(facilityDialog).toBeHidden()

  await page.goto('/demo/mesa/12')
  await expect(page.getByRole('heading', { name: /Chame o garçom/ })).toBeVisible()
  await page.getByRole('radio', { name: 'Pedir a conta' }).check({ force: true })
  await page.getByRole('button', { name: 'Chamar garçom' }).click()
  const staffLink = page.getByRole('link', { name: /Abrir painel do garçom/ })
  await expect(staffLink).toBeVisible()
  await expect(staffLink).toHaveAttribute('href', /\/garcom\?mesa=12&motivo=Pedir\+a\+conta/)
  await page.screenshot({ path: 'artifacts/final/demo-mesa-390x844.png' })

  await page.goto('/garcom?mesa=12&motivo=Pedir%20a%20conta')
  await expect(page.getByRole('heading', { name: 'Chamados do garçom' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Ativar alertas/ })).toBeVisible()
  const queued = page.getByRole('article').first()
  await expect(queued).toHaveAttribute('aria-label', /Mesa 12/)
  await expect(queued).toContainText('Aguardando atendimento')
  await page
    .getByRole('button', { name: /Atender/ })
    .first()
    .click()
  await expect(page.getByText('Você está a caminho').first()).toBeVisible()
  await page.screenshot({ path: 'artifacts/final/garcom-390x844.png' })
})
