import type { StaffCall, StaffCallReason } from '@/types/project'
import { siteConfig } from '@/config/site'

export type StaffCallRequest = {
  table: string
  reasonId: string
  reason: string
  note?: string
}

/**
 * Origem usada para montar links absolutos (QR Code, compartilhamento).
 * No navegador vale o host atual, o que mantém a demonstração funcionando em
 * localhost, em preview e no domínio final sem configuração extra.
 */
export function resolveOrigin() {
  if (typeof window !== 'undefined') return window.location.origin
  return siteConfig.url
}

export function buildCustomerUrl(staffCall: StaffCall, origin = resolveOrigin()) {
  return `${origin}${staffCall.customerPath}`
}

export function buildStaffUrl(
  staffCall: StaffCall,
  reason?: StaffCallReason,
  note?: string,
  origin = resolveOrigin(),
) {
  const params = new URLSearchParams({ mesa: staffCall.table })
  if (reason) {
    params.set('motivo', reason.label)
    params.set('id', reason.id)
  }
  const sanitizedNote = note?.trim()
  if (sanitizedNote) params.set('obs', sanitizedNote.slice(0, 160))
  return `${origin}${staffCall.staffPath}?${params.toString()}`
}

export function parseStaffCallRequest(searchParams: {
  mesa?: string
  motivo?: string
  id?: string
  obs?: string
}): StaffCallRequest | null {
  const table = searchParams.mesa?.trim()
  if (!table) return null
  return {
    table: table.slice(0, 12),
    reasonId: searchParams.id?.trim().slice(0, 40) || 'chamado',
    reason: searchParams.motivo?.trim().slice(0, 60) || 'Atendimento na mesa',
    note: searchParams.obs?.trim().slice(0, 160) || undefined,
  }
}
