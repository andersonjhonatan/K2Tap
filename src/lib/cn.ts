import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina estados de componentes e resolve utilitários Tailwind conflitantes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
