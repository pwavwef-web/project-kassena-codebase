import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/sora/wght.css'
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
