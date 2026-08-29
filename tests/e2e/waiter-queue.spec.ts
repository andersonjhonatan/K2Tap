import { expect, test } from '@playwright/test'

test('o chamado sai da mesa, chega no painel e volta como status para o cliente', async ({
  context,
}) => {
  const mesa = await context.newPage()
  await mesa.setViewportSize({ width: 390, height: 844 })
  await mesa.goto('/demo/mesa/12')
  await mesa.getByRole('radio', { name: /Pedir a conta/ }).check({ force: true })
  await mesa.getByRole('button', { name: 'Chamar garçom' }).click()
  await expect(mesa.getByText(/Chamado enviado da mesa 12/)).toBeVisible()

  const garcom = await context.newPage()
  await garcom.setViewportSize({ width: 390, height: 844 })
  await garcom.goto('/garcom')
  await expect(garcom.getByRole('article', { name: 'Mesa 12 — Pedir a conta' })).toBeVisible()

  await garcom.getByRole('button', { name: /Atender/ }).click()
  await expect(garcom.getByText('Você está a caminho')).toBeVisible()

  await mesa.bringToFront()
  await expect(mesa.getByText(/Garçom a caminho da mesa 12/)).toBeVisible({ timeout: 5000 })
  await mesa.screenshot({ path: 'artifacts/final/mesa-garcom-a-caminho.png' })

  await garcom.getByRole('button', { name: /Concluir/ }).click()
  await mesa.bringToFront()
  await expect(mesa.getByText('Atendimento concluído')).toBeVisible({ timeout: 5000 })

  await garcom.screenshot({ path: 'artifacts/final/garcom-fila-390x844.png' })
})
