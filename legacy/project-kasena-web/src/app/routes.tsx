import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../components/admin/AdminLayout'
import {
  AdminRoute,
  ProtectedRoute,
  ValidatorRoute,
} from '../components/common/RouteGuards'
import { MainLayout } from '../components/layout/MainLayout'
import { MarketingLayout } from '../marketing/layout/MarketingLayout'

// Route-level code splitting: each page becomes its own chunk so the marketing
// home does not download the whole application (admin, dashboard, etc.).
const lazyPage = <T extends Record<string, React.ComponentType>>(
  loader: () => Promise<T>,
  name: keyof T,
) => lazy(() => loader().then((m) => ({ default: m[name] })))

// --- Marketing ---
const MarketingHomePage = lazyPage(() => import('../marketing/pages/HomePage'), 'HomePage')
const AboutPage = lazyPage(() => import('../marketing/pages/AboutPage'), 'AboutPage')
const BuildPage = lazyPage(() => import('../marketing/pages/BuildPage'), 'BuildPage')
const HowItWorksPage = lazyPage(() => import('../marketing/pages/HowItWorksPage'), 'HowItWorksPage')
const AiDataPage = lazyPage(() => import('../marketing/pages/AiDataPage'), 'AiDataPage')
const ImpactPage = lazyPage(() => import('../marketing/pages/ImpactPage'), 'ImpactPage')
const HeritagePage = lazyPage(() => import('../marketing/pages/HeritagePage'), 'HeritagePage')
const AlliancePage = lazyPage(() => import('../marketing/pages/AlliancePage'), 'AlliancePage')
const PartnersPage = lazyPage(() => import('../marketing/pages/PartnersPage'), 'PartnersPage')
const TransparencyPage = lazyPage(() => import('../marketing/pages/TransparencyPage'), 'TransparencyPage')
const UpdatesPage = lazyPage(() => import('../marketing/pages/UpdatesPage'), 'UpdatesPage')
const TeamPage = lazyPage(() => import('../marketing/pages/TeamPage'), 'TeamPage')
const ContactPage = lazyPage(() => import('../marketing/pages/ContactPage'), 'ContactPage')
const LegalPage = lazyPage(() => import('../marketing/pages/LegalPage'), 'LegalPage')
const MarketingNotFoundPage = lazyPage(() => import('../marketing/pages/NotFoundPage'), 'NotFoundPage')

// --- Application ---
const LoginPage = lazyPage(() => import('../pages/LoginPage'), 'LoginPage')
const DictionaryPage = lazyPage(() => import('../pages/DictionaryPage'), 'DictionaryPage')
const CulturePage = lazyPage(() => import('../pages/CulturePage'), 'CulturePage')
const SupportPage = lazyPage(() => import('../pages/SupportPage'), 'SupportPage')
const DonatePage = lazyPage(() => import('../pages/DonatePage'), 'DonatePage')
const DonationSuccessPage = lazyPage(() => import('../pages/DonationSuccessPage'), 'DonationSuccessPage')
const DashboardPage = lazyPage(() => import('../pages/DashboardPage'), 'DashboardPage')
const CompleteProfilePage = lazyPage(() => import('../pages/CompleteProfilePage'), 'CompleteProfilePage')
const ContributionsPage = lazyPage(() => import('../pages/ContributionsPage'), 'ContributionsPage')
const LeaderboardPage = lazyPage(() => import('../pages/LeaderboardPage'), 'LeaderboardPage')
const AnnouncementsPage = lazyPage(() => import('../pages/AnnouncementsPage'), 'AnnouncementsPage')
const AchievementsPage = lazyPage(() => import('../pages/AchievementsPage'), 'AchievementsPage')
const RewardsPage = lazyPage(() => import('../pages/RewardsPage'), 'RewardsPage')
const SubmitContributionPage = lazyPage(() => import('../pages/SubmitContributionPage'), 'SubmitContributionPage')
const UploadsPage = lazyPage(() => import('../pages/UploadsPage'), 'UploadsPage')
const ProfilePage = lazyPage(() => import('../pages/ProfilePage'), 'ProfilePage')

// --- Admin ---
const AdminDashboardPage = lazyPage(() => import('../pages/admin/AdminDashboardPage'), 'AdminDashboardPage')
const AdminSubmissionsPage = lazyPage(() => import('../pages/admin/AdminSubmissionsPage'), 'AdminSubmissionsPage')
const AdminUploadsPage = lazyPage(() => import('../pages/admin/AdminUploadsPage'), 'AdminUploadsPage')
const AdminUsersPage = lazyPage(() => import('../pages/admin/AdminUsersPage'), 'AdminUsersPage')
const AdminDictionaryPage = lazyPage(() => import('../pages/admin/AdminDictionaryPage'), 'AdminDictionaryPage')
const AdminDonationsPage = lazyPage(() => import('../pages/admin/AdminDonationsPage'), 'AdminDonationsPage')
const AdminAnnouncementsPage = lazyPage(() => import('../pages/admin/AdminAnnouncementsPage'), 'AdminAnnouncementsPage')
const AdminSettingsPage = lazyPage(() => import('../pages/admin/AdminSettingsPage'), 'AdminSettingsPage')

export const router = createBrowserRouter([
  // ------------------------------------------------------------------
  // Public marketing website (new premium shell).
  // ------------------------------------------------------------------
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <MarketingHomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/build', element: <BuildPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/ai-data', element: <AiDataPage /> },
      { path: '/impact', element: <ImpactPage /> },
      { path: '/heritage', element: <HeritagePage /> },
      { path: '/alliance', element: <AlliancePage /> },
      { path: '/partners', element: <PartnersPage /> },
      { path: '/transparency', element: <TransparencyPage /> },
      { path: '/updates', element: <UpdatesPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/legal', element: <LegalPage /> },
      { path: '/legal/:slug', element: <LegalPage /> },
      { path: '*', element: <MarketingNotFoundPage /> },
    ],
  },

  // ------------------------------------------------------------------
  // Web application (existing shell) — all routes preserved unchanged.
  // ------------------------------------------------------------------
  {
    element: <MainLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/dictionary', element: <DictionaryPage /> },
      { path: '/culture', element: <CulturePage /> },
      { path: '/support', element: <SupportPage /> },
      { path: '/support/donate', element: <DonatePage /> },
      { path: '/support/success', element: <DonationSuccessPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/complete-profile', element: <CompleteProfilePage /> },
          { path: '/contributions', element: <ContributionsPage /> },
          { path: '/leaderboard', element: <LeaderboardPage /> },
          { path: '/announcements', element: <AnnouncementsPage /> },
          { path: '/achievements', element: <AchievementsPage /> },
          { path: '/achiements', element: <AchievementsPage /> },
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
                  { path: 'donations', element: <AdminDonationsPage /> },
                  {
                    path: 'announcements',
                    element: <AdminAnnouncementsPage />,
                  },
                  { path: 'settings', element: <AdminSettingsPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])
