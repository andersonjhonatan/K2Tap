'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Radio, RotateCcw } from 'lucide-react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import styles from './nfc-demo.styles'

const steps = [
  {
    id: 1,
    title: 'Aproxime',
    description: 'O cliente aproxima o celular da peça física.',
    status: 'Aproxime o celular da K2 Tap.',
  },
  {
    id: 2,
    title: 'Conecte',
    description: 'A K2 Tap transmite o destino usando NFC.',
    status: 'NFC reconhecido. Conectando…',
  },
  {
    id: 3,
    title: 'Confirme',
    description: 'O celular identifica e exibe a experiência.',
    status: 'Experiência encontrada. Confirme para abrir.',
  },
  {
    id: 4,
    title: 'Interaja',
    description: 'A página abre para pedir, avaliar, chamar ou comprar.',
    status: 'A experiência digital está pronta.',
  },
] as const

export function NfcDemo() {
  const [step, setStep] = useState(1)
  const demoRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  const stopDemo = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const startDemo = useCallback(() => {
    stopDemo()
    setStep(1)
    if (reducedMotion) return
    timerRef.current = setInterval(() => {
      setStep((current) => (current === 4 ? 1 : current + 1))
    }, 2600)
  }, [reducedMotion, stopDemo])

  useEffect(() => {
    const element = demoRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startDemo()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      stopDemo()
    }
  }, [startDemo, stopDemo])

  const selectStep = (nextStep: number) => {
    stopDemo()
    setStep(nextStep)
  }

  const activeStep = steps[step - 1]

  return (
    <section className="section" id="como" aria-labelledby="nfc-demo-title">
      <div className="wrap">
        <div className={styles.demo} data-step={step} ref={demoRef}>
          <div className={styles.header}>
            <div>
              <small>Veja acontecendo</small>
              <h2 id="nfc-demo-title">
                Do toque à ação,
                <br />
                em poucos segundos.
              </h2>
            </div>
            <p>
              Não precisa imaginar. A demonstração abaixo simula o que o cliente vê quando usa uma
              K2 Tap no mundo real.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.controls}>
              <div className={styles.tabList} role="tablist" aria-label="Etapas da demonstração">
                {steps.map((item) => {
                  const active = step === item.id
                  return (
                    <button
                      key={item.id}
                      className={cn(styles.step, active && styles.activeStep)}
                      type="button"
                      role="tab"
                      aria-label={`${String(item.id).padStart(2, '0')} ${item.title} — ${item.description}`}
                      aria-selected={active}
                      aria-controls="nfc-demo-scene"
                      tabIndex={active ? 0 : -1}
                      onClick={() => selectStep(item.id)}
                    >
                      <span className={styles.stepNumber}>{String(item.id).padStart(2, '0')}</span>
                      <span>
                        <b>{item.title}</b>
                        <span className={styles.stepDescription}>{item.description}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <button className={styles.replay} type="button" onClick={startDemo}>
                <RotateCcw size={14} aria-hidden="true" /> Reproduzir demonstração
              </button>
            </div>

            <div className={styles.scene} id="nfc-demo-scene" role="tabpanel" aria-live="polite">
              <div className={styles.caption}>SIMULAÇÃO / K2 TAP</div>
              <div className={styles.status}>{activeStep.status}</div>
              <div className={styles.deskShadow} />
              <div className={styles.tag}>
                <div className={styles.tagBrand}>
                  K2 <b>TAP</b>
                </div>
                <div className={styles.tagIcon}>
                  <Radio size={19} aria-hidden="true" />
                </div>
                <div className={styles.tagCopy}>
                  APROXIME SEU CELULAR
                  <br />
                  <b>PARA ACESSAR.</b>
                </div>
              </div>
              <div className={styles.rays} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.phone}>
                <div className={styles.wallpaper}>
                  <div className={styles.time}>10:24</div>
                  <div className={styles.date}>Quinta-feira, 27 de agosto</div>
                </div>
                <div className={styles.notice}>
                  <div className={styles.noticeIcon}>K2</div>
                  <div>
                    <b>K2 Tap encontrada</b>
                    <span>Toque para abrir a experiência</span>
                  </div>
                </div>
                <div className={styles.browser}>
                  <div className={styles.browserPill}>k2tap.com/k2-coffee</div>
                  <div className={styles.browserCover}>
                    <small>BEM-VINDO</small>
                    <h3>K2 Coffee</h3>
                    <span>Escolha o que quer fazer agora.</span>
                  </div>
                  <div className={styles.browserActions}>
                    <span>☕ Cardápio</span>
                    <span>◉ WhatsApp</span>
                    <span>★ Avaliar</span>
                    <span>⌖ Localização</span>
                  </div>
                  <div className={styles.browserBottom}>
                    <b>Uma experiência feita para a marca.</b>
                    <br />
                    Sem procurar link, número ou perfil.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
