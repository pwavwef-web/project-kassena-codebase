import { useContext } from 'react'
import { AnnouncementNotificationsContext } from '../contexts/AnnouncementNotificationsContextValue'

export const useAnnouncementNotifications = () => {
  const context = useContext(AnnouncementNotificationsContext)

  if (!context) {
    throw new Error(
      'useAnnouncementNotifications must be used within AnnouncementNotificationsProvider',
    )
  }

  return context
}
