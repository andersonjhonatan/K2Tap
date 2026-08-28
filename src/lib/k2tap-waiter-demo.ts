export type WaiterRequestType = 'waiter' | 'soda' | 'water' | 'bill'

export type WaiterRequestStatus = 'pending' | 'accepted' | 'done'

export type WaiterRequest = {
  id: string
  table: string
  type: WaiterRequestType
  label: string
  createdAt: string
  status: WaiterRequestStatus
  acceptedAt?: string
  completedAt?: string
}

export const K2TAP_DEMO_STORAGE_KEY = 'k2tap-waiter-demo-v1'
export const K2TAP_DEMO_EVENT = 'k2tap-waiter-demo-update'

const REQUEST_LABELS: Record<WaiterRequestType, string> = {
  waiter: 'Chamar garçom',
  soda: 'Refrigerante',
  water: 'Água',
  bill: 'Pedir a conta',
}

export function requestLabel(type: WaiterRequestType) {
  return REQUEST_LABELS[type]
}

export function readWaiterRequests(): WaiterRequest[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(K2TAP_DEMO_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as WaiterRequest[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeWaiterRequests(requests: WaiterRequest[]) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(K2TAP_DEMO_STORAGE_KEY, JSON.stringify(requests))
  window.dispatchEvent(new Event(K2TAP_DEMO_EVENT))
}

export function createWaiterRequest(table: string, type: WaiterRequestType) {
  const request: WaiterRequest = {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    table,
    type,
    label: requestLabel(type),
    createdAt: new Date().toISOString(),
    status: 'pending',
  }

  const next = [request, ...readWaiterRequests()].slice(0, 50)
  writeWaiterRequests(next)
  return request
}

export function updateWaiterRequest(id: string, status: WaiterRequestStatus) {
  const now = new Date().toISOString()
  const next = readWaiterRequests().map((request) => {
    if (request.id !== id) return request

    return {
      ...request,
      status,
      ...(status === 'accepted' ? { acceptedAt: now } : {}),
      ...(status === 'done' ? { completedAt: now } : {}),
    }
  })

  writeWaiterRequests(next)
}

export function clearWaiterRequests() {
  writeWaiterRequests([])
}
