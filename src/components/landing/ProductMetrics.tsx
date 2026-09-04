import { Reveal } from '@/components/ui/Reveal'
import styles from './landing.styles'

const metrics = [
  {
    value: '01',
    title: 'Objeto físico.',
    description: 'Uma presença real no ponto de contato com o cliente.',
  },
  {
    value: '∞',
    title: 'Possibilidades digitais.',
    description: 'O destino pode acompanhar diferentes necessidades do negócio.',
  },
  {
    value: '1 tap',
    title: 'Menos atrito.',
    description: 'O cliente não precisa memorizar, digitar ou procurar o endereço.',
  },
]

export function ProductMetrics() {
  return (
    <section className={styles.proof} aria-label="Benefícios em números">
      <div className="wrap">
        <Reveal className={styles.metrics}>
          {metrics.map((metric) => (
            <article className={styles.metric} key={metric.value}>
              <strong>{metric.value}</strong>
              <p>
                <b>{metric.title}</b>
                <br />
                {metric.description}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
