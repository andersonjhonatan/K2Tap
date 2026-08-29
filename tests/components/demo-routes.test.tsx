import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DemoExperience } from '@/components/demo/DemoExperience'
import { WaiterPanel } from '@/components/waiter/WaiterPanel'
import { getProjectBySlug } from '@/data/projects'

const restaurant = getProjectBySlug('k2-restaurante')!

describe('DemoExperience', () => {
  it('roda a experiência completa em tela cheia', () => {
    render(<DemoExperience project={restaurant} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'O sabor da casa, a um toque.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /QR Code da rede Wi-Fi/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /QR Code Pix demonstrativo/ })).toBeInTheDocument()
    expect(screen.getByTitle('Mapa de K2 Restaurante')).toBeInTheDocument()
  })

  it('anuncia a mesa quando a rota vem de uma peça de mesa', () => {
    render(<DemoExperience project={restaurant} table="7" />)

    expect(screen.getAllByText('Mesa 7').length).toBeGreaterThan(0)
  })

  it('envia o chamado e entrega o link do painel da equipe', async () => {
    const user = userEvent.setup()
    render(<DemoExperience project={restaurant} table="12" />)

    await user.click(screen.getByRole('radio', { name: 'Pedir a conta' }))
    await user.click(screen.getByRole('button', { name: 'Chamar garçom' }))

    const link = await screen.findByRole(
      'link',
      { name: /Abrir painel do garçom/ },
      { timeout: 4000 },
    )
    await waitFor(() => expect(link).toHaveAttribute('href', expect.stringContaining('/garcom?')))
    expect(link.getAttribute('href')).toContain('mesa=12')
    expect(link.getAttribute('href')).toContain('motivo=Pedir+a+conta')
    expect(screen.getByText(/Garçom a caminho da mesa 12/)).toBeInTheDocument()
  })
})

describe('WaiterPanel', () => {
  it('mostra o chamado recebido pela rota no topo da fila', () => {
    render(<WaiterPanel incoming={{ table: '12', reason: 'Pedir a conta' }} role="Garçom" />)

    const calls = screen.getAllByRole('article')
    expect(calls[0]).toHaveAccessibleName('Mesa 12 — Pedir a conta')
    expect(screen.getByText(/enviado agora pela mesa/)).toBeInTheDocument()
  })

  it('permite atender e concluir um chamado', async () => {
    const user = userEvent.setup()
    render(<WaiterPanel incoming={{ table: '12', reason: 'Pedir a conta' }} role="Garçom" />)

    await user.click(screen.getAllByRole('button', { name: 'Atender' })[0])
    expect(screen.getAllByText('Em atendimento').length).toBeGreaterThan(0)

    await user.click(screen.getAllByRole('button', { name: /Concluir/ })[0])
    expect(screen.getAllByText('Concluído').length).toBeGreaterThan(0)
  })

  it('funciona sem chamado na rota', () => {
    render(<WaiterPanel incoming={null} role="Garçom" />)

    expect(screen.getByRole('heading', { name: 'Chamados do garçom' })).toBeInTheDocument()
    expect(screen.queryByText(/enviado agora pela mesa/)).not.toBeInTheDocument()
  })
})
