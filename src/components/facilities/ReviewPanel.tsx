'use client'

import { Send, Star } from 'lucide-react'
import { useReviewForm } from '@/hooks/useReviewForm'
import styles from './facilities.module.css'

export function ReviewPanel() {
  const { score, setScore, comment, setComment, submitted, submit } = useReviewForm()

  if (submitted) {
    return (
      <div className={`${styles.panel} ${styles.reviewSuccess}`} role="status">
        <div className={styles.successMark}>
          <Star size={22} fill="currentColor" aria-hidden="true" />
        </div>
        <b>Obrigado pela sua opinião.</b>
        <span>
          Nesta demonstração, nada foi enviado ou armazenado. Em um projeto real, a resposta pode
          seguir para o fluxo definido pela empresa.
        </span>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Uma área rápida para ouvir o cliente logo após a experiência. O envio desta demonstração não
        é armazenado.
      </p>
      <form className={styles.reviewCard} onSubmit={submit}>
        <div className={styles.reviewScore}>
          <div>
            <strong>{score.toFixed(1)}</strong>
            <span>Como foi sua experiência?</span>
          </div>
          <div className={styles.reviewStars} role="radiogroup" aria-label="Nota da experiência">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                className={star <= score ? styles.selectedStar : ''}
                key={star}
                type="button"
                role="radio"
                aria-checked={star === score}
                aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                onClick={() => setScore(star)}
              >
                <Star size={22} fill="currentColor" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <label className={styles.reviewField}>
          <span>Sua opinião</span>
          <textarea
            value={comment}
            rows={4}
            maxLength={280}
            placeholder="Conte em poucas palavras como foi sua experiência..."
            onChange={(event) => setComment(event.target.value)}
          />
        </label>
        <button className={styles.reviewSend} type="submit">
          Enviar opinião
          <Send size={13} aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
