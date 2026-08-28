import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationPanel } from '@/components/facilities/LocationPanel'
import { projects } from '@/data/projects'

describe('LocationPanel', () => {
  it('usa clipboard como fallback quando Web Share não existe', async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn().mockResolvedValue(true)
    const onNotify = vi.fn()
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined })

    render(<LocationPanel project={projects[0]} onCopy={onCopy} onNotify={onNotify} />)
    await user.click(screen.getByRole('button', { name: /Compartilhar/ }))

    expect(onCopy).toHaveBeenCalledWith(
      expect.stringContaining('Av. Boa Viagem'),
      expect.objectContaining({ title: 'Localização copiada' }),
    )
    expect(screen.getByText(/Localização pronta para compartilhar/)).toBeInTheDocument()
  })
})
