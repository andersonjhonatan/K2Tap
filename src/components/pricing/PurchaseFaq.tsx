import { Reveal } from '@/components/ui/Reveal'
import styles from './pricing.module.css'

const questions = [
  {
    question: 'O K2 Tap precisa de bateria?',
    answer: 'Não. A tecnologia NFC funciona por aproximação e não precisa de bateria ou recarga.',
  },
  {
    question: 'Qual a diferença entre Cartão e Expositor?',
    answer:
      'O Cartão é compacto e portátil. O Expositor foi pensado para ficar em balcões, recepções e mesas, oferecendo NFC e QR Code.',
  },
  {
    question: 'O Combo vem com os dois produtos?',
    answer: 'Sim. O Combo inclui 1 Cartão K2 Tap e 1 Expositor K2 Tap.',
  },
  {
    question: 'O QR Code está incluso no Expositor?',
    answer: 'Sim. O Expositor oferece as duas formas de acesso: QR Code e NFC.',
  },
  {
    question: 'Posso personalizar com a minha marca?',
    answer: 'Sim. A personalização pode seguir a identidade visual do seu negócio.',
  },
  {
    question: 'Preciso instalar algum aplicativo?',
    answer: 'Não. O cliente acessa diretamente pelo recurso NFC ou pela câmera do celular.',
  },
  {
    question: 'Funciona em Android e iPhone?',
    answer:
      'Funciona em celulares Android e iPhone compatíveis com leitura NFC. O QR Code permanece como alternativa no Expositor.',
  },
  {
    question: 'Depois posso alterar meus links?',
    answer:
      'Sim. O destino digital pode ser atualizado sem precisar substituir o produto físico.',
  },
]

export function PurchaseFaq() {
  return (
    <section className={`${styles.section} ${styles.faqSection}`} aria-labelledby="faq-title">
      <div className={`wrap ${styles.faqGrid}`}>
        <Reveal className={styles.faqHeading}>
          <span className={styles.eyebrow}>Antes de escolher</span>
          <h2 id="faq-title">Perguntas frequentes.</h2>
          <p>O essencial para comprar seu K2 Tap com segurança.</p>
        </Reveal>

        <Reveal className={styles.faqList}>
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
