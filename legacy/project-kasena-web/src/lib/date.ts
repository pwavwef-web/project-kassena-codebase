import type { Timestamp } from 'firebase/firestore'

export const toDateLabel = (value?: Timestamp | null): string => {
  if (!value) {
    return '-'
  }

  return value.toDate().toLocaleString()
}
