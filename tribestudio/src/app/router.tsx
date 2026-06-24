import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { DashboardPage } from '../pages/DashboardPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// Starter route map. Codex will add real workspace areas (contributions,
// review queues, translation, validation, members, settings). Auth/role guards
// are intentionally not wired yet — see the legacy admin app for reference.
export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
