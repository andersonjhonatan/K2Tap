'use client'

import { useSyncExternalStore } from 'react'
import {
  readServerWaiterCalls,
  readWaiterCalls,
  subscribeToWaiterQueue,
  type WaiterCall,
} from '@/lib/waiter-queue'

/** A fila de chamados como fonte externa: sem efeito de sincronização e sem descompasso na hidratação. */
export function useWaiterQueue(): WaiterCall[] {
  return useSyncExternalStore(subscribeToWaiterQueue, readWaiterCalls, readServerWaiterCalls)
}
