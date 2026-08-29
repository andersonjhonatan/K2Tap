import { useId } from 'react'

type LogoTone = 'light' | 'dark'

type LogoProps = {
  /** `dark` para fundos escuros (K prateado), `light` para fundos claros (K em tinta). */
  tone?: LogoTone
  className?: string
  title?: string
}

/** O K prateado some em fundo claro, então a tinta da marca entra no lugar. */
const kStops: Record<LogoTone, [string, string, string, string]> = {
  dark: ['#ffffff', '#e8eef5', '#a7b4c3', '#eef2f7'],
  light: ['#2b3a4d', '#0d1826', '#3d5063', '#0b1420'],
}

const tapColor: Record<LogoTone, string> = { dark: '#f2f6fb', light: '#0b1420' }
const taglineColor: Record<LogoTone, string> = { dark: '#c6d5e5', light: '#5d6877' }

function Gradients({ id, tone }: { id: string; tone: LogoTone }) {
  const [a, b, c, d] = kStops[tone]
  return (
    <defs>
      <linearGradient id={`${id}-k`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset="0.42" stopColor={b} />
        <stop offset="0.56" stopColor={c} />
        <stop offset="1" stopColor={d} />
      </linearGradient>
      <linearGradient id={`${id}-2`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#6cb8ff" />
        <stop offset="0.48" stopColor="#1f7cf0" />
        <stop offset="1" stopColor="#0a4099" />
      </linearGradient>
      <linearGradient id={`${id}-card`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#1b232e" />
        <stop offset="1" stopColor="#0b1119" />
      </linearGradient>
    </defs>
  )
}

/**
 * O cartão sobre o leitor. Em tamanhos pequenos o leitor vira um borrão, então
 * o cabeçalho e o ícone usam só o cartão.
 */
function TapMark({ id, withReader = true }: { id: string; withReader?: boolean }) {
  return (
    <g>
      {withReader && (
        <>
          <ellipse cx="0" cy="40" rx="54" ry="17" fill="#151b24" />
          <path d="M-54 40a54 17 0 0 0 108 0v10a54 17 0 0 1-108 0z" fill="#0d121a" />
          <ellipse cx="0" cy="38" rx="32" ry="10" fill="none" stroke="#2f9dff" strokeWidth="3" />
        </>
      )}
      <g transform="rotate(-19)">
        <rect
          x="-42"
          y="-52"
          width="96"
          height="62"
          rx="11"
          fill={`url(#${id}-card)`}
          stroke="#2f9dff"
          strokeWidth="3"
        />
        <rect x="-30" y="-40" width="17" height="13" rx="2.5" fill="#c9d2dd" />
        <path d="M-30 -33.5h17M-21.5 -40v13" stroke="#8b95a3" strokeWidth="1.2" />
        <g stroke="#2f9dff" strokeWidth="2.8" fill="none" strokeLinecap="round">
          <path d="M18 -14a9 9 0 0 1 0-14" />
          <path d="M26 -10a17 17 0 0 1 0-22" />
          <path d="M34 -6a25 25 0 0 1 0-30" />
        </g>
      </g>
    </g>
  )
}

/** As letras, desenhadas como vetor para não depender de fonte instalada. */
function Wordmark({ id }: { id: string }) {
  return (
    <g transform="skewX(-9)">
      <path d="M0 0h30v42L66 0h40L58 52l50 48H68L30 58v42H0z" fill={`url(#${id}-k)`} />
      <path
        d="M116 30c0-18 16-31 42-31s42 13 42 32c0 15-9 25-29 40l-22 17h52v12h-86V88l54-42c11-9 15-14 15-20 0-9-9-14-24-14s-24 6-24 17z"
        fill={`url(#${id}-2)`}
      />
    </g>
  )
}

/**
 * Lockup completo: marca, K2, TAP e a assinatura. A assinatura sai quando o
 * contexto já traz uma frase própria logo abaixo — como no rodapé.
 */
export function K2TapLogo({
  tone = 'dark',
  className,
  title = 'K2 Tap',
  showTagline = true,
}: LogoProps & { showTagline?: boolean }) {
  const id = useId().replace(/:/g, '')

  return (
    <svg
      viewBox={showTagline ? '24 4 292 332' : '24 4 292 300'}
      className={className}
      role="img"
      aria-label={title}
    >
      <Gradients id={id} tone={tone} />
      <g transform="translate(170 68)">
        <TapMark id={id} />
      </g>
      <g transform="translate(87 148) scale(0.88)">
        <Wordmark id={id} />
      </g>
      <g transform="translate(170 288)">
        <line x1="-134" y1="-8" x2="-64" y2="-8" stroke="#2f9dff" strokeWidth="2.4" />
        <line x1="64" y1="-8" x2="134" y2="-8" stroke="#2f9dff" strokeWidth="2.4" />
        <text
          x="7"
          y="0"
          textAnchor="middle"
          fill={tapColor[tone]}
          fontFamily="Inter, Arial, sans-serif"
          fontSize="42"
          fontWeight="500"
          letterSpacing="14"
        >
          TAP
        </text>
      </g>
      {showTagline && (
        <g transform="translate(0 322)">
          <g
            transform="translate(32 0)"
            stroke="#2f9dff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M0 4a6 6 0 0 1 0-8" />
            <path d="M6 8a12 12 0 0 1 0-16" />
          </g>
          <text
            x="182"
            y="4"
            textAnchor="middle"
            fill={taglineColor[tone]}
            fontFamily="Inter, Arial, sans-serif"
            fontSize="13"
            fontWeight="600"
            letterSpacing="5.5"
          >
            PAGUE COM UM TOQUE
          </text>
        </g>
      )}
    </svg>
  )
}

/** Lockup horizontal: marca à esquerda, K2 TAP à direita. Para o cabeçalho. */
export function K2TapLockup({ tone = 'light', className, title = 'K2 Tap' }: LogoProps) {
  const id = useId().replace(/:/g, '')

  return (
    <svg viewBox="0 0 258 96" className={className} role="img" aria-label={title}>
      <Gradients id={id} tone={tone} />
      <g transform="translate(26 48) scale(0.42)">
        <TapMark id={id} withReader={false} />
      </g>
      <g transform="translate(76 24) scale(0.5)">
        <Wordmark id={id} />
      </g>
      <text
        x="190"
        y="74"
        fill={tapColor[tone]}
        fontFamily="Inter, Arial, sans-serif"
        fontSize="22"
        fontWeight="600"
        letterSpacing="7"
      >
        TAP
      </text>
    </svg>
  )
}

/** Só a marca, sem letras. Para ícones e espaços apertados. */
export function K2TapMark({ className, title = 'K2 Tap' }: Omit<LogoProps, 'tone'>) {
  const id = useId().replace(/:/g, '')

  return (
    <svg viewBox="0 0 116 86" className={className} role="img" aria-label={title}>
      <Gradients id={id} tone="dark" />
      <g transform="translate(58 43) scale(0.82)">
        <TapMark id={id} withReader={false} />
      </g>
    </svg>
  )
}
