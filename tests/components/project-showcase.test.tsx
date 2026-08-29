import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectShowcase } from '@/components/showcase/ProjectShowcase'

describe('ProjectShowcase', () => {
  it('troca entre os quatro projetos fictícios', async () => {
    const user = userEvent.setup()
    render(<ProjectShowcase />)

    expect(screen.getByText('O sabor da casa, a um toque.')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /K2 Barbearia/ }))
    expect(screen.getByText('Seu próximo corte começa aqui.')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /K2 Loja/ }))
    expect(screen.getByText('Sua vitrine continua no celular.')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /K2 Serviço/ }))
    expect(screen.getByText(/Explique o que precisa/)).toBeInTheDocument()
  })

  it('abre, navega e fecha o modal interno', async () => {
    const user = userEvent.setup()
    render(<ProjectShowcase />)

    await user.click(screen.getByRole('button', { name: /Wi-Fi Conecte/ }))
    expect(screen.getByRole('dialog', { name: 'Conecte-se ao Wi-Fi' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /QR Code da rede Wi-Fi/ })).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Pix' }))
    expect(screen.getByText('Aponte a câmera e pague.')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /QR Code Pix demonstrativo/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('copia a senha e exibe toast de sucesso', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true })
    render(<ProjectShowcase />)

    await user.click(screen.getByRole('button', { name: /Wi-Fi Conecte/ }))
    await user.click(screen.getByRole('button', { name: 'Copiar senha do Wi-Fi' }))

    expect(writeText).toHaveBeenCalledWith('K2Restaurante@2026')
    expect(await screen.findByText('Copiado com sucesso')).toBeInTheDocument()
  })

  it('permite avaliar sem recarregar e mostra o estado de sucesso', async () => {
    const user = userEvent.setup()
    render(<ProjectShowcase />)

    await user.click(screen.getByRole('button', { name: /Avaliar Conte/ }))
    await user.click(screen.getByRole('radio', { name: '5 estrelas' }))
    await user.type(
      screen.getByPlaceholderText(/Conte em poucas palavras/),
      'Experiência excelente.',
    )
    await user.click(screen.getByRole('button', { name: /Enviar opinião/ }))

    expect(screen.getByText('Obrigado pela sua opinião.')).toBeInTheDocument()
  })

  it('fecha o modal com Escape e devolve o foco ao acionador', async () => {
    const user = userEvent.setup()
    render(<ProjectShowcase />)
    const opener = screen.getByRole('button', { name: /Como chegar Mapa/ })

    await user.click(opener)
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  })
  it('chama o garçom e revela os links do cliente e da equipe', async () => {
    const user = userEvent.setup()
    render(<ProjectShowcase />)

    await user.click(screen.getByRole('button', { name: /PRECISA DE ALGUMA COISA/ }))
    expect(screen.getByRole('dialog', { name: 'Chamar atendimento' })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Pedir a conta' }))
    await user.click(screen.getByRole('button', { name: 'Chamar garçom' }))

    expect(
      await screen.findByText(/Garçom a caminho da mesa 12/, {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Motivo enviado: Pedir a conta/)).toBeInTheDocument()

    const links = screen.getAllByRole('link', { name: /Abrir link/ })
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('/demo/mesa/12'))
    expect(links[1]).toHaveAttribute('href', expect.stringContaining('/garcom'))
  })

  it('leva para a rota da demonstração real do projeto ativo', async () => {
    const user = userEvent.setup()
    render(<ProjectShowcase />)

    expect(screen.getByRole('link', { name: /Veja como fica na sua empresa/ })).toHaveAttribute(
      'href',
      '/demo/k2-restaurante',
    )
    expect(screen.getByRole('link', { name: /Tela do cliente na mesa 12/ })).toHaveAttribute(
      'href',
      '/demo/mesa/12',
    )
    expect(screen.getByRole('link', { name: /Painel do garçom/ })).toHaveAttribute(
      'href',
      '/garcom',
    )

    await user.click(screen.getByRole('tab', { name: /K2 Barbearia/ }))

    expect(screen.getByRole('link', { name: /Veja como fica na sua empresa/ })).toHaveAttribute(
      'href',
      '/demo/k2-barbearia',
    )
    expect(screen.queryByRole('link', { name: /Painel do garçom/ })).not.toBeInTheDocument()
  })
})
