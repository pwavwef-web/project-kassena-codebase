import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AnnouncementNotificationsProvider } from './contexts/AnnouncementNotificationsContext'
import { AuthProvider } from './contexts/AuthContext'
import App from './app/App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AnnouncementNotificationsProvider>
        <App />
      </AnnouncementNotificationsProvider>
    </AuthProvider>
  </StrictMode>,
)
