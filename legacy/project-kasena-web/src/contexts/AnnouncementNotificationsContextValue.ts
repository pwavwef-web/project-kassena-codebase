import { createContext } from 'react'
import type { Announcement } from '../types'

export interface AnnouncementNotificationsContextValue {
  announcements: Announcement[]
  errorMessage: string
  isLoading: boolean
  markAllRead: () => void
  unreadCount: number
}

export const AnnouncementNotificationsContext =
  createContext<AnnouncementNotificationsContextValue | undefined>(undefined)
