import type { CSSProperties } from 'react'
import type { ProjectConfig } from '@/types/project'

/**
 * Traduz o tema do projeto para as variáveis que as duas superfícies usam —
 * a prévia no telefone e a demonstração em tela cheia.
 */
export function experienceTheme(theme: ProjectConfig['theme']): CSSProperties {
  return {
    '--experience-bg': theme.background,
    '--experience-fg': theme.foreground,
    '--experience-muted': theme.muted,
    '--experience-accent': theme.accent,
    '--experience-on-accent': theme.onAccent,
    '--experience-surface': theme.surface,
    '--experience-border': theme.border,
  } as CSSProperties
}
