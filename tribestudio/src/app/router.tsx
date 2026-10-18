import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from './App'
import { NotFoundPage } from '../pages/NotFoundPage'
import {
  AdminPage,
  AnalyticsPage,
  AchievementsPage,
  AuthPage,
  CampaignsPage,
  ContentPage,
  CreatePage,
  DashboardPage,
  LanguagesPage,
  OnboardingPage,
  ProfilePage,
  ReviewsPage,
  RewardsPage,
  SettingsPage,
} from '../pages/StudioPages'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/create', element: <CreatePage /> },
      { path: '/content', element: <ContentPage /> },
      { path: '/languages', element: <LanguagesPage /> },
      { path: '/reviews', element: <ReviewsPage /> },
      { path: '/campaigns', element: <CampaignsPage /> },
      { path: '/rewards', element: <RewardsPage /> },
      { path: '/achievements', element: <AchievementsPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
