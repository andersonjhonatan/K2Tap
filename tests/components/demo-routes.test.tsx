import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DemoExperience } from '@/components/demo/DemoExperience'
import { WaiterPanel } from '@/components/waiter/WaiterPanel'
import { getProjectBySlug } from '@/data/projects'
import { SALON_ORDERS_KEY } from '@/lib/salon-orders'
import { SALON_TABLE_COUNT_KEY } from '@/lib/salon-settings'
import {
  WAITER_QUEUE_KEY,
  readWaiterCalls,
  updateWaiterCall,
  writeWaiterCalls,
} from '@/lib/waiter-queue'

const restaurant = getProjectBySlug('k2-restaurante')!

beforeEach(() => {
  window.localStorage.removeItem(WAITER_QUEUE_KEY)
  window.localStorage.removeItem(SALON_TABLE_COUNT_KEY)
  window.localStorage.removeItem(SALON_ORDERS_KEY)
})

describe('DemoExperience', () => {
  it('não oferece a mesma facilidade em dois lugares', () => {
    render(<DemoExperience project={restaurant} />)

    // As ações da casa já levam a Wi-Fi, Pix, mapa e avaliação com o nome que o
    // negócio dá. A linha de facilidades só mostra o que sobrou — aqui, redes.
    expect(screen.getAllByRole('button', { name: /Wi-Fi/ })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: /Pague Fácil/ })).toHaveLength(1)
    expect(screen.queryByRole('button', { name: /^Pix/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Redes/ })).toHaveLength(1)

    // E o chamado do garçom aparece uma vez só, no cartão dedicado.
    expect(screen.getAllByRole('button', { name: 'Chamar garçom' })).toHaveLength(1)
  })

  it('lista as cinco facilidades quando as ações do projeto não cobrem nenhuma', () => {
    const barber = getProjectBySlug('k2-barbearia')!
    render(<DemoExperience project={barber} />)

    for (const label of ['Wi-Fi', 'Pix', 'Redes', 'Mapa', 'Opinião']) {
      expect(screen.getByRole('button', { name: new RegExp(label) })).toBeInTheDocument()
    }
  })

  it('roda a experiência completa em tela cheia, com as facilidades fechadas', () => {
    render(<DemoExperience project={restaurant} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'O sabor da casa, a um toque.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /O que você pode fazer/ })).toBeInTheDocument()

    // Nada de QR Code, mapa ou formulário abertos antes de o cliente pedir.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /QR Code/ })).not.toBeInTheDocument()
    expect(screen.queryByTitle('Mapa de K2 Restaurante')).not.toBeInTheDocument()
  })

  it('abre a facilidade em modal, troca de aba e fecha devolvendo o foco', async () => {
    const user = userEvent.setup()
    render(<DemoExperience project={restaurant} />)

    const opener = screen.getByRole('button', { name: /Wi-Fi Conecte pelo QR Code/ })
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

    await user.click(screen.getByRole('button', { name: /Avaliar Conte como foi/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('anuncia a mesa uma única vez quando a rota vem de uma peça de mesa', () => {
    render(<DemoExperience project={restaurant} table="7" />)

    expect(screen.getAllByText('Mesa 7')).toHaveLength(1)
  })

  it('coloca o chamado na fila e entrega o link do painel da equipe', async () => {
    const user = userEvent.setup()
    render(<DemoExperience project={restaurant} table="12" />)

    await user.click(screen.getByRole('radio', { name: /Pedir a conta/ }))
    await user.type(screen.getByRole('textbox', { name: /Observação/ }), 'Trazer molho extra')
    await user.click(screen.getByRole('button', { name: 'Chamar garçom' }))

    const link = await screen.findByRole(
      'link',
      { name: /Abrir painel do garçom/ },
      { timeout: 4000 },
    )
    expect(link.getAttribute('href')).toContain('mesa=12')
    expect(link.getAttribute('href')).toContain('motivo=Pedir+a+conta')
    expect(link.getAttribute('href')).toContain('obs=Trazer+molho+extra')
    expect(screen.getByText(/Chamado enviado da mesa 12/)).toBeInTheDocument()

    const queued = readWaiterCalls()
    expect(queued).toHaveLength(1)
    expect(queued[0]).toMatchObject({
      table: '12',
      reason: 'Pedir a conta',
      note: 'Trazer molho extra',
      status: 'pending',
    })
  })
})

describe('WaiterPanel', () => {
  it('semeia na fila o chamado que chegou pela rota', async () => {
    render(
      <WaiterPanel
        incoming={{
          table: '12',
          reasonId: 'conta',
          reason: 'Pedir a conta',
          note: 'Cliente com uma criança',
        }}
        role="Garçom"
        tablePath="/demo/mesa/12"
      />,
    )

    const call = await screen.findByRole('article', { name: 'Mesa 12 — Pedir a conta' })
    expect(within(call).getByText('Aguardando atendimento')).toBeInTheDocument()
    expect(within(call).getByText('Cliente com uma criança')).toBeInTheDocument()
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

  it('mostra exatamente a quantidade de mesas configurada', async () => {
    const user = userEvent.setup()
    render(<WaiterPanel incoming={null} role="Garçom" tablePath="/demo/mesa/12" />)

    await user.click(screen.getByRole('button', { name: 'Configurar mesas' }))
    const input = screen.getByRole('spinbutton', { name: /Quantidade de mesas/ })

    fireEvent.change(input, { target: { value: '10' } })
    expect(screen.getAllByRole('button', { name: /^Mesa \d+, livre$/ })).toHaveLength(10)

    fireEvent.change(input, { target: { value: '50' } })
    expect(screen.getAllByRole('button', { name: /^Mesa \d+, livre$/ })).toHaveLength(50)
  })

  it('organiza pedidos em etapas e permite avançar a produção', async () => {
    const user = userEvent.setup()
    render(<WaiterPanel incoming={null} role="Garçom" tablePath="/demo/mesa/12" />)

    await user.click(screen.getByRole('button', { name: /^Pedidos/ }))
    expect(screen.getByRole('heading', { name: 'Produção do salão' })).toBeInTheDocument()
    expect(screen.getByText('Saiu / pronto')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Iniciar preparo' }))
    expect(screen.getAllByRole('button', { name: 'Marcar como pronto' })).toHaveLength(2)
  })

  it('lista os chamados do mais antigo para o mais recente', () => {
    const baseCall = {
      reasonId: 'conta',
      reason: 'Pedir a conta',
      icon: 'bill' as const,
      status: 'pending' as const,
    }
    writeWaiterCalls([
      { ...baseCall, id: 'newer', table: '12', createdAt: '2026-09-03T20:02:00.000Z' },
      { ...baseCall, id: 'older', table: '3', createdAt: '2026-09-03T20:01:00.000Z' },
    ])

    render(<WaiterPanel incoming={null} role="Garçom" tablePath="/demo/mesa/12" />)

    const queue = screen.getByRole('region', { name: 'Fila de atendimento' })
    const queueButtons = within(queue).getAllByRole('button')
    expect(queueButtons[0]).toHaveTextContent('1ºMesa 03')
    expect(queueButtons[1]).toHaveTextContent('2ºMesa 12')
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

  it('informa e atualiza a posição da mesa para o cliente', async () => {
    const user = userEvent.setup()
    writeWaiterCalls([
      {
        id: 'older',
        table: '3',
        reasonId: 'pedido',
        reason: 'Fazer o pedido',
        icon: 'order',
        createdAt: new Date(Date.now() - 60_000).toISOString(),
        status: 'pending',
      },
    ])

    render(<DemoExperience project={restaurant} table="12" />)
    await user.click(screen.getByRole('button', { name: 'Chamar garçom' }))

    expect(
      await screen.findByText('Sua mesa está em 2º lugar.', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 mesa está antes de você.')).toBeInTheDocument()

    updateWaiterCall('older', 'accepted')
    await waitFor(() =>
      expect(screen.getByText('Sua mesa é a próxima a ser atendida.')).toBeInTheDocument(),
    )
  })
})
