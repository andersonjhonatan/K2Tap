import { Reveal } from '@/components/ui/Reveal'
import styles from './landing.module.css'

const possibilities = [
  'WhatsApp',
  'Instagram',
  'Cardápio',
  'Catálogo',
  'Avaliações',
  'Localização',
  'Portfólio',
  'Campanhas',
]

export function Possibilities() {
  return (
    <section
      className={styles.possibilities}
      id="possibilidades"
      aria-labelledby="possibilities-title"
    >
      <div className="wrap">
        <Reveal className={styles.sectionHead}>
          <div>
            <span className="eyebrow">Uma K2 Tap. Muitos caminhos.</span>
            <h2 id="possibilities-title">
              O toque pode levar
              <br />
              aonde o negócio precisa.
            </h2>
          </div>
          <p>
            Não limitamos a K2 Tap a um cartão digital. Ela pode ser o ponto de partida para
            diferentes experiências, de acordo com o contexto do cliente.
          </p>
        </Reveal>

        <Reveal className={styles.uses}>
          <article className={styles.bigUse}>
            <div>
              <span className="eyebrow">Experiência personalizada</span>
              <h3>Uma página feita para a marca — não um perfil igual para todo mundo.</h3>
              <p>
                Combine links, ações, informações, campanhas e identidade visual em uma experiência
                própria.
              </p>
            </div>
            <div className={styles.chips}>
              {possibilities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className={styles.orb} aria-hidden="true" />
          </article>
          <div className={styles.sideColumn}>
            <article className={styles.sideUse}>
              <small>Para vender melhor</small>
              <h3>Do balcão para o catálogo.</h3>
              <p>Use o toque para reduzir passos entre curiosidade, informação e ação.</p>
            </article>
            <article className={styles.sideUse}>
              <small>Para atender melhor</small>
              <h3>Do atendimento para o WhatsApp.</h3>
              <p>
                Entregue o canal certo sem pedir para o cliente procurar usuário, número ou link.
              </p>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
