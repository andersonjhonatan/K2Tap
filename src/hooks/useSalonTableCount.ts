'use client'

import { useSyncExternalStore } from 'react'
import {
  readSalonTableCount,
  readServerSalonTableCount,
  subscribeToSalonTableCount,
} from '@/lib/salon-settings'

export function useSalonTableCount() {
  return useSyncExternalStore(
    subscribeToSalonTableCount,
    readSalonTableCount,
    readServerSalonTableCount,
  )
}
