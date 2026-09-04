'use client'

import { useSyncExternalStore } from 'react'
import { readSalonOrders, readServerSalonOrders, subscribeToSalonOrders } from '@/lib/salon-orders'

export function useSalonOrders() {
  return useSyncExternalStore(subscribeToSalonOrders, readSalonOrders, readServerSalonOrders)
}
