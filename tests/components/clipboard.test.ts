import { copyToClipboard } from '@/hooks/useClipboard'

describe('copyToClipboard', () => {
  it('usa o fallback seguro quando Clipboard API não está disponível', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: false })
    document.execCommand = vi.fn().mockReturnValue(true)

    await expect(copyToClipboard('K2 Tap')).resolves.toBe(true)
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).not.toBeInTheDocument()
  })
})
