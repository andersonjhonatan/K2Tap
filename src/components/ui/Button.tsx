import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import styles from './ui.module.css'

type ButtonProps = ComponentPropsWithoutRef<'a'> & {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'light'
  external?: boolean
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  external = false,
  ...props
}: ButtonProps) {
  return (
    <a
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
      {external && <ArrowUpRight size={16} aria-hidden="true" />}
    </a>
  )
}
