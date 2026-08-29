import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DemoExperience } from '@/components/demo/DemoExperience'
import { WaiterPanel } from '@/components/waiter/WaiterPanel'
import { getProjectBySlug } from '@/data/projects'
import { WAITER_QUEUE_KEY, readWaiterCalls } from '@/lib/waiter-queue'

const restaurant = getProjectBySlug('k2-restaurante')!

beforeEach(() => {
  window.localStorage.removeItem(WAITER_QUEUE_KEY)
})

describe('DemoExperience', () => {
  it('roda a experiência completa em tela cheia, com as facilidades fechadas', () => {
    render(<DemoExperience project={restaurant} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'O sabor da casa, a um toque.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Facilidades da casa' })).toBeInTheDocument()

    // Nada de QR Code, mapa ou formulário abertos antes de o cliente pedir.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /QR Code/ })).not.toBeInTheDocument()
    expect(screen.queryByTitle('Mapa de K2 Restaurante')).not.toBeInTheDocument()
  })

  it('abre a facilidade em modal, troca de aba e fecha devolvendo o foco', async () => {
    const user = userEvent.setup()
    render(<DemoExperience project={restaurant} />)

    const opener = screen.getByRole('button', { name: /Wi-Fi Escaneie/ })
    await user.click(opener)

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('img', { name: /QR Code da rede Wi-Fi/ })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('tab', { name: 'Pix' }))
    expect(
      within(dialog).getByRole('img', { name: /QR Code Pix demonstrativo/ }),
    ).toBeInTheDocument()
    expect(within(dialog).queryByRole('img', { name: /Wi-Fi/ })).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('tab', { name: 'Mapa' }))
    expect(within(dialog).getByTitle('Mapa de K2 Restaurante')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  })

  it('fecha o modal com Escape', async () => {
    const user = userEvent.setup()
    render(<DemoExperience project={restaurant} />)

    await user.click(screen.getByRole('button', { name: /Opinião Um minuto/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('anuncia a mesa quando a rota vem de uma peça de mesa', () => {
    render(<DemoExperience project={restaurant} table="7" />)

    expect(screen.getAllByText('Mesa 7').length).toBeGreaterThan(0)
  })

  it('coloca o chamado na fila e entrega o link do painel da equipe', async () => {
    const user = userEvent.setup()
    render(<DemoExperience project={restaurant} table="12" />)

    await user.click(screen.getByRole('radio', { name: /Pedir a conta/ }))
    await user.click(screen.getByRole('button', { name: 'Chamar garçom' }))

    const link = await screen.findByRole(
      'link',
      { name: /Abrir painel do garçom/ },
      { timeout: 4000 },
    )
    expect(link.getAttribute('href')).toContain('mesa=12')
    expect(link.getAttribute('href')).toContain('motivo=Pedir+a+conta')
    expect(screen.getByText(/Chamado enviado da mesa 12/)).toBeInTheDocument()

    const queued = readWaiterCalls()
    expect(queued).toHaveLength(1)
    expect(queued[0]).toMatchObject({ table: '12', reason: 'Pedir a conta', status: 'pending' })
  })
})

describe('WaiterPanel', () => {
  it('semeia na fila o chamado que chegou pela rota', async () => {
    render(
      <WaiterPanel
        incoming={{ table: '12', reasonId: 'conta', reason: 'Pedir a conta' }}
        role="Garçom"
        tablePath="/demo/mesa/12"
      />,
    )

    const call = await screen.findByRole('article', { name: 'Mesa 12 — Pedir a conta' })
    expect(within(call).getByText('Aguardando atendimento')).toBeInTheDocument()
    expect(readWaiterCalls()).toHaveLength(1)
  })

  it('atende e conclui um chamado', async () => {
    const user = userEvent.setup()
    render(
      <WaiterPanel
        incoming={{ table: '12', reasonId: 'conta', reason: 'Pedir a conta' }}
        role="Garçom"
        tablePath="/demo/mesa/12"
      />,
    )

    await user.click(await screen.findByRole('button', { name: /Atender/ }))
    expect(await screen.findByText('Você está a caminho')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Concluir/ }))
    expect(await screen.findByText('Atendimento concluído')).toBeInTheDocument()
    expect(readWaiterCalls()[0].status).toBe('done')
  })

  it('mostra a fila vazia e o preparo do aparelho quando não há chamado', () => {
    render(<WaiterPanel incoming={null} role="Garçom" tablePath="/demo/mesa/12" />)

    expect(screen.getByRole('heading', { name: 'Chamados do garçom' })).toBeInTheDocument()
    expect(screen.getByText('Nenhuma mesa chamando')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ativar alertas/ })).toBeInTheDocument()
  })
})

describe('fila compartilhada entre a mesa e a equipe', () => {
  it('o cliente vê o status mudar quando a equipe atende', async () => {
    const user = userEvent.setup()
    const table = render(<DemoExperience project={restaurant} table="12" />)

    await user.click(screen.getByRole('button', { name: 'Chamar garçom' }))
    await screen.findByText(/Chamado enviado da mesa 12/, {}, { timeout: 4000 })

    const waiter = render(<WaiterPanel incoming={null} role="Garçom" tablePath="/demo/mesa/12" />, {
      container: document.body.appendChild(document.createElement('div')),
    })

    await user.click(await waiter.findByRole('button', { name: /Atender/ }))

    await waitFor(() => expect(table.getByText(/Garçom a caminho da mesa 12/)).toBeInTheDocument())
  })
})
