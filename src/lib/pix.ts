import type { ProjectConfig } from '@/types/project'

export type PixPresentation = {
  qrValue: string
  receiver: string
  key: string
  isDemo: boolean
}

/**
 * Presentation adapter for the demo. A real provider can supply a BR Code payload
 * through `pix.payload` without changing any facility component.
 */
export function getPixPresentation(pix: ProjectConfig['pix']): PixPresentation {
  return {
    qrValue:
      pix.payload ??
      `K2TAP-DEMO|PIX|receiver=${encodeURIComponent(pix.receiver)}|key=${encodeURIComponent(pix.key)}|no-charge=true`,
    receiver: pix.receiver,
    key: pix.key,
    isDemo: pix.provider === 'demo',
  }
}
