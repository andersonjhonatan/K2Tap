export type SalonOrderStatus = 'waiting' | 'preparing' | 'ready' | 'delivered'

export type SalonOrder = {
  id: string
  code: string
  table: string
  customer: string
  items: string[]
  note?: string
  total: string
  timeLabel: string
  status: SalonOrderStatus
}

export const SALON_ORDERS_KEY = 'k2tap-salon-orders-v1'
export const SALON_ORDERS_EVENT = 'k2tap-salon-orders-update'

export const DEFAULT_SALON_ORDERS: SalonOrder[] = [
  {
    id: 'demo-104',
    code: '#104',
    table: '07',
    customer: 'Mesa 07',
    items: ['2× Hambúrguer da casa', '1× Batata grande', '2× Refrigerante'],
    note: 'Um hambúrguer sem cebola.',
    total: 'R$ 78,00',
    timeLabel: 'há 3 min',
    status: 'waiting',
  },
  {
    id: 'demo-103',
    code: '#103',
    table: '12',
    customer: 'Mesa 12',
    items: ['1× Frango da brasa', '1× Suco de laranja'],
    total: 'R$ 46,00',
    timeLabel: 'há 8 min',
    status: 'preparing',
  },
  {
    id: 'demo-102',
    code: '#102',
    table: '04',
    customer: 'Mesa 04',
    items: ['2× Prato executivo', '1× Água com gás'],
    note: 'Levar molho extra.',
    total: 'R$ 59,50',
    timeLabel: 'há 14 min',
    status: 'ready',
  },
  {
    id: 'demo-101',
    code: '#101',
    table: '09',
    customer: 'Mesa 09',
    items: ['1× Sobremesa da casa', '2× Café'],
    total: 'R$ 31,00',
    timeLabel: 'há 22 min',
    status: 'delivered',
  },
]

const STATUS_FLOW: SalonOrderStatus[] = ['waiting', 'preparing', 'ready', 'delivered']

let cachedRaw: string | null = null
let cachedOrders = DEFAULT_SALON_ORDERS

function parseOrders(raw: string | null): SalonOrder[] {
  if (!raw) return DEFAULT_SALON_ORDERS
  try {
    const parsed = JSON.parse(raw) as SalonOrder[]
    return Array.isArray(parsed) ? parsed : DEFAULT_SALON_ORDERS
  } catch {
    return DEFAULT_SALON_ORDERS
  }
}

export function readSalonOrders() {
  if (typeof window === 'undefined') return DEFAULT_SALON_ORDERS

  try {
    const raw = window.localStorage.getItem(SALON_ORDERS_KEY)
    if (raw !== cachedRaw) {
      cachedRaw = raw
      cachedOrders = parseOrders(raw)
    }
  } catch {
    return cachedOrders
  }

  return cachedOrders
}

export function readServerSalonOrders() {
  return DEFAULT_SALON_ORDERS
}

export function writeSalonOrders(orders: SalonOrder[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SALON_ORDERS_KEY, JSON.stringify(orders))
  } catch {
    // Em modo privativo o quadro segue utilizável durante a sessão atual.
  }
  window.dispatchEvent(new Event(SALON_ORDERS_EVENT))
}

export function advanceSalonOrder(id: string) {
  writeSalonOrders(
    readSalonOrders().map((order) => {
      if (order.id !== id) return order
      const current = STATUS_FLOW.indexOf(order.status)
      const status = STATUS_FLOW[Math.min(current + 1, STATUS_FLOW.length - 1)]
      return { ...order, status }
    }),
  )
}

export function addDemoSalonOrder(tableCount: number) {
  const existing = readSalonOrders()
  const stamp = Date.now()
  const table = String((existing.length * 3 + 2) % Math.max(1, tableCount) || 1).padStart(2, '0')
  const order: SalonOrder = {
    id: `demo-${stamp}`,
    code: `#${105 + existing.length}`,
    table,
    customer: `Mesa ${table}`,
    items: ['1× Pedido demonstrativo', '1× Bebida da casa'],
    note: 'Pedido adicionado pelo painel para teste.',
    total: 'R$ 38,00',
    timeLabel: 'agora',
    status: 'waiting',
  }
  writeSalonOrders([order, ...existing])
}

export function resetSalonOrders() {
  writeSalonOrders(DEFAULT_SALON_ORDERS)
}

export function subscribeToSalonOrders(onChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === SALON_ORDERS_KEY) onChange()
  }

  window.addEventListener(SALON_ORDERS_EVENT, onChange)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(SALON_ORDERS_EVENT, onChange)
    window.removeEventListener('storage', handleStorage)
  }
}
