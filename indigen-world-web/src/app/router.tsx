import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { NotFoundPage } from '../pages/NotFoundPage'
import {
  AboutPage,
  ArticlePage,
  CommunitiesPage,
  ContactPage,
  ContributePage,
  CulturalDataPage,
  HomePage,
  ImpactPage,
  LanguagesPage,
  PartnersPage,
  PrivacyPage,
  ProgrammesPage,
  StoriesPage,
  SupportPage,
  TermsPage,
  UpdatesPage,
} from '../pages/PublicPages'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/programmes', element: <ProgrammesPage /> },
      { path: '/communities', element: <CommunitiesPage /> },
      { path: '/languages', element: <LanguagesPage /> },
      { path: '/stories', element: <StoriesPage /> },
      { path: '/impact', element: <ImpactPage /> },
      { path: '/partners', element: <PartnersPage /> },
      { path: '/contribute', element: <ContributePage /> },
      { path: '/support', element: <SupportPage /> },
      { path: '/updates', element: <UpdatesPage /> },
      { path: '/updates/:slug', element: <ArticlePage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/cultural-data', element: <CulturalDataPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
