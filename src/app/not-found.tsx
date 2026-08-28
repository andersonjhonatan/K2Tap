import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Brand } from '@/components/ui/Brand'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div>
        <Brand />
        <p className="eyebrow" style={{ marginTop: 38 }}>
          Erro 404
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-.07em', margin: 14 }}>
          Esta conexão não foi encontrada.
        </h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          O endereço pode ter mudado ou ainda não existe.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 20,
            padding: '14px 20px',
            borderRadius: 999,
            background: 'var(--ink)',
            color: 'white',
            fontWeight: 800,
          }}
        >
          <ArrowLeft size={16} /> Voltar ao início
        </Link>
      </div>
    </main>
  )
}
