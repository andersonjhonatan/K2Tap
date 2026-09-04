import type { StaffCallReason, StaffCallReasonIcon } from '@/types/project'

export type WaiterCallStatus = 'pending' | 'accepted' | 'done'

export type WaiterCall = {
  id: string
  table: string
  reasonId: string
  reason: string
  note?: string
  icon: StaffCallReasonIcon
  createdAt: string
  status: WaiterCallStatus
  acceptedAt?: string
  completedAt?: string
}

export const WAITER_QUEUE_KEY = 'k2tap-waiter-queue-v1'
export const WAITER_QUEUE_EVENT = 'k2tap-waiter-queue-update'

const MAX_CALLS = 50

/** Referência simples para comunicar uma previsão honesta ao cliente. */
export const ESTIMATED_MINUTES_PER_CALL = 4

/**
 * A fila vive no armazenamento do próprio navegador. Isso mantém a demonstração
 * sem backend e ainda assim real: a tela da mesa e o painel da equipe abertos no
 * mesmo aparelho — em abas ou janelas diferentes — enxergam o mesmo estado.
 */
const EMPTY: WaiterCall[] = []

let cachedRaw: string | null = null
let cachedCalls: WaiterCall[] = EMPTY

function parseCalls(raw: string | null): WaiterCall[] {
  if (!raw) return EMPTY
  try {
    const parsed = JSON.parse(raw) as WaiterCall[]
    return Array.isArray(parsed) ? parsed : EMPTY
  } catch {
    return EMPTY
  }
}

/**
 * Snapshot estável para `useSyncExternalStore`: enquanto o texto guardado não
 * muda, o mesmo array é devolvido, o que evita re-renderizações em loop.
 */
export function readWaiterCalls(): WaiterCall[] {
  if (typeof window === 'undefined') return EMPTY

  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(WAITER_QUEUE_KEY)
  } catch {
    return cachedCalls
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedCalls = parseCalls(raw)
  }
  return cachedCalls
}

export function readServerWaiterCalls(): WaiterCall[] {
  return EMPTY
}

export function writeWaiterCalls(calls: WaiterCall[]) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(WAITER_QUEUE_KEY, JSON.stringify(calls))
  } catch {
    // Modo privativo ou cota cheia: a sessão atual continua funcionando em memória.
  }
  window.dispatchEvent(new Event(WAITER_QUEUE_EVENT))
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createWaiterCall(
  table: string,
  reason: StaffCallReason,
  note?: string,
): WaiterCall {
  const sanitizedNote = note?.trim().slice(0, 160)
  const call: WaiterCall = {
    id: createId(),
    table,
    reasonId: reason.id,
    reason: reason.label,
    note: sanitizedNote || undefined,
    icon: reason.icon,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }

  writeWaiterCalls([call, ...readWaiterCalls()].slice(0, MAX_CALLS))
  return call
}

export function updateWaiterCall(id: string, status: WaiterCallStatus) {
  const now = new Date().toISOString()
  writeWaiterCalls(
    readWaiterCalls().map((call) =>
      call.id === id
        ? {
            ...call,
            status,
            ...(status === 'accepted' ? { acceptedAt: now } : {}),
            ...(status === 'done' ? { completedAt: now } : {}),
          }
        : call,
    ),
  )
}

export function clearWaiterCalls() {
  writeWaiterCalls([])
}

/** Chamado ainda em aberto de uma mesa, usado para mostrar o status ao cliente. */
export function findOpenCall(calls: WaiterCall[], table: string) {
  return calls.find((call) => call.table === table && call.status !== 'done')
}

/** Chamados pendentes em ordem justa: o horário mais antigo vem primeiro. */
export function sortPendingWaiterCalls(calls: WaiterCall[]) {
  return calls
    .filter((call) => call.status === 'pending')
    .toSorted((first, second) => {
      const timeDifference =
        new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
      return timeDifference || first.id.localeCompare(second.id)
    })
}

/** Posição humana (1, 2, 3...) de um chamado que ainda aguarda atendimento. */
export function waiterQueuePosition(calls: WaiterCall[], id: string) {
  const index = sortPendingWaiterCalls(calls).findIndex((call) => call.id === id)
  return index === -1 ? null : index + 1
}

export function estimatedWaitMinutes(position: number) {
  return Math.max(1, position) * ESTIMATED_MINUTES_PER_CALL
}

/**
 * Escuta a fila na aba atual (evento próprio) e nas demais abas do mesmo
 * navegador (evento `storage`). Devolve a função de cancelamento.
 */
export function subscribeToWaiterQueue(onChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === WAITER_QUEUE_KEY) onChange()
  }

  window.addEventListener(WAITER_QUEUE_EVENT, onChange)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(WAITER_QUEUE_EVENT, onChange)
    window.removeEventListener('storage', handleStorage)
  }
}

export function formatWaiting(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}min ${String(rest).padStart(2, '0')}s`
}

export function waitingSeconds(call: WaiterCall, now: number) {
  const reference = call.status === 'done' ? call.completedAt : undefined
  const end = reference ? new Date(reference).getTime() : now
  return Math.max(0, Math.floor((end - new Date(call.createdAt).getTime()) / 1000))
}

/** Tempo entre a chamada da mesa e a confirmação da equipe. */
export function responseSeconds(call: WaiterCall) {
  if (!call.acceptedAt) return null
  return Math.max(
    0,
    Math.floor((new Date(call.acceptedAt).getTime() - new Date(call.createdAt).getTime()) / 1000),
  )
}
