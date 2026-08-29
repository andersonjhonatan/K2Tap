'use client'

import { useState } from 'react'

/** Estado da avaliação rápida, igual nas duas superfícies que a exibem. */
export function useReviewForm(initialScore = 5) {
  const [score, setScore] = useState(initialScore)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return { score, setScore, comment, setComment, submitted, submit }
}
