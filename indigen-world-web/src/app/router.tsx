import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'

// Starter route map. Codex will expand the public site (about, programmes,
// heritage, impact, etc.) — see the legacy site for the full information
// architecture: legacy/project-kasena-web + docs/project-kasena-web/.
export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
