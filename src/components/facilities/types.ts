export type CopyFeedback = {
  title: string
  description: string
}

export type CopyHandler = (value: string, feedback?: CopyFeedback) => Promise<boolean>
