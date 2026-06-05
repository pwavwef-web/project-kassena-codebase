import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../components/admin/AdminLayout'
import {
  AdminRoute,
  ProtectedRoute,
  ValidatorRoute,
} from '../components/common/RouteGuards'
import { MainLayout } from '../components/layout/MainLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminDictionaryPage } from '../pages/admin/AdminDictionaryPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { AdminSubmissionsPage } from '../pages/admin/AdminSubmissionsPage'
import { AdminUploadsPage } from '../pages/admin/AdminUploadsPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { CompleteProfilePage } from '../pages/CompleteProfilePage'
import { ContributionsPage } from '../pages/ContributionsPage'
import { CulturePage } from '../pages/CulturePage'
import { DashboardPage } from '../pages/DashboardPage'
import { DictionaryPage } from '../pages/DictionaryPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RewardsPage } from '../pages/RewardsPage'
import { SubmitContributionPage } from '../pages/SubmitContributionPage'
import { UploadsPage } from '../pages/UploadsPage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/dictionary', element: <DictionaryPage /> },
      { path: '/culture', element: <CulturePage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/complete-profile', element: <CompleteProfilePage /> },
          { path: '/contributions', element: <ContributionsPage /> },
          { path: '/rewards', element: <RewardsPage /> },
          { path: '/submit', element: <SubmitContributionPage /> },
          { path: '/uploads', element: <UploadsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
      {
        path: '/admin',
        element: <ValidatorRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'submissions', element: <AdminSubmissionsPage /> },
              { path: 'uploads', element: <AdminUploadsPage /> },
              {
                element: <AdminRoute />,
                children: [
                  { path: 'users', element: <AdminUsersPage /> },
                  { path: 'dictionary', element: <AdminDictionaryPage /> },
                  { path: 'settings', element: <AdminSettingsPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
