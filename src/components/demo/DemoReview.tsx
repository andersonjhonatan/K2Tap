'use client'

import { useState } from 'react'
import { Send, Star } from 'lucide-react'
import styles from './demo.module.css'

export function DemoReview({ projectName }: { projectName: string }) {
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className={styles.reviewDone} role="status">
        <span className={styles.reviewDoneMark} aria-hidden="true">
          <Star size={22} fill="currentColor" />
        </span>
        <b>Obrigado pela sua opinião.</b>
        <span>
          Nesta demonstração nada é enviado ou armazenado. Em um projeto real, a resposta segue para
          o fluxo escolhido por {projectName}.
        </span>
      </div>
    )
  }

  return (
    <form
      className={styles.reviewForm}
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <div className={styles.reviewStars} role="radiogroup" aria-label="Nota da experiência">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            className={star <= score ? styles.reviewStarOn : ''}
            key={star}
            type="button"
            role="radio"
            aria-checked={star === score}
            aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
            onClick={() => setScore(star)}
          >
            <Star size={26} fill="currentColor" aria-hidden="true" />
          </button>
        ))}
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
      <button className={styles.reviewSubmit} type="submit">
        Enviar opinião
        <Send size={14} aria-hidden="true" />
      </button>
    </form>
  )
}
