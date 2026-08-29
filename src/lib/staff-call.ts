import type { StaffCall } from '@/types/project'
import { siteConfig } from '@/config/site'

export type StaffCallRequest = {
  table: string
  reason: string
  /** Momento do chamado em ISO, usado para calcular a espera no painel da equipe. */
  at: string
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
  request?: Pick<StaffCallRequest, 'reason'>,
  origin = resolveOrigin(),
) {
  const params = new URLSearchParams({ mesa: staffCall.table })
  if (request?.reason) params.set('motivo', request.reason)
  return `${origin}${staffCall.staffPath}?${params.toString()}`
}

export function parseStaffCallRequest(searchParams: {
  mesa?: string
  motivo?: string
}): StaffCallRequest | null {
  const table = searchParams.mesa?.trim()
  if (!table) return null
  return {
    table: table.slice(0, 12),
    reason: searchParams.motivo?.trim().slice(0, 60) || 'Atendimento na mesa',
    at: new Date().toISOString(),
  }
}
