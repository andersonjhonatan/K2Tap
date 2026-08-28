import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NfcDemo } from '@/components/landing/NfcDemo'

describe('NfcDemo', () => {
  it('permite selecionar uma etapa e reiniciar a demonstração', async () => {
    const user = userEvent.setup()
    render(<NfcDemo />)

    await user.click(screen.getByRole('tab', { name: /04 Interaja/ }))
    expect(screen.getByText('A experiência digital está pronta.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Reproduzir demonstração/ }))
    expect(screen.getByText('Aproxime o celular da K2 Tap.')).toBeInTheDocument()
  })
})
