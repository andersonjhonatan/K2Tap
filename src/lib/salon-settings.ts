export const SALON_TABLE_COUNT_KEY = 'k2tap-salon-table-count-v1'
export const SALON_TABLE_COUNT_EVENT = 'k2tap-salon-table-count-update'

export const DEFAULT_TABLE_COUNT = 30
export const MAX_TABLE_COUNT = 100

export function normalizeTableCount(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_TABLE_COUNT
  return Math.min(MAX_TABLE_COUNT, Math.max(1, Math.round(value)))
}

export function readSalonTableCount() {
  if (typeof window === 'undefined') return DEFAULT_TABLE_COUNT
  try {
    const stored = window.localStorage.getItem(SALON_TABLE_COUNT_KEY)
    return stored === null ? DEFAULT_TABLE_COUNT : normalizeTableCount(Number(stored))
  } catch {
    return DEFAULT_TABLE_COUNT
  }
}

export function readServerSalonTableCount() {
  return DEFAULT_TABLE_COUNT
}

export function writeSalonTableCount(value: number) {
  if (typeof window === 'undefined') return
  const count = normalizeTableCount(value)
  try {
    window.localStorage.setItem(SALON_TABLE_COUNT_KEY, String(count))
  } catch {
    // A configuração continua disponível durante a sessão atual do componente.
  }
  window.dispatchEvent(new Event(SALON_TABLE_COUNT_EVENT))
}

export function subscribeToSalonTableCount(onChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === SALON_TABLE_COUNT_KEY) onChange()
  }

  window.addEventListener(SALON_TABLE_COUNT_EVENT, onChange)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(SALON_TABLE_COUNT_EVENT, onChange)
    window.removeEventListener('storage', handleStorage)
  }
}
