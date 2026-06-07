import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  getDashboardMetrics,
  listApprovedUploads,
  getPublicDashboardMetrics,
  setPublicDashboardMetrics,
  subscribeToLeaderboard,
  subscribeToLeaderboardUser,
  listRewardCatalogItems,
} from '../lib/firestore.ts'
import { APP_NAME } from '../lib/constants'
import type { LeaderboardProfile, RewardCatalogItem } from '../types'
import { SearchBar } from '../components/common/SearchBar'
import { CommunityProgressDashboard } from '../components/common/CommunityProgressDashboard'
import { ContributorRewards } from '../components/common/ContributorRewards'
import { CommunityActivityFeed } from '../components/common/CommunityActivityFeed'
import { LeaderboardPreview } from '../components/common/LeaderboardPreview'
import { CulturalSpotlight } from '../components/common/CulturalSpotlight'
import { UnreadAnnouncementBadge } from '../components/common/UnreadAnnouncementBadge'
import { useAnnouncementNotifications } from '../hooks/useAnnouncementNotifications'
import { MissionCarousel } from '../components/common/MissionCarousel'
// Types defined locally for homepage data

interface ActivityItem {
  id: string
  type: 'contribution' | 'proverb' | 'points' | 'dialect' | 'upload'
  message: string
  timestamp: string
}

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  avatar?: string
}

interface CulturalItem {
  id: string
  type: 'proverb' | 'story' | 'fact' | 'expression'
  title: string
  content: string
  attribution?: string
}

export const HomePage = () => {
  const { appUser } = useAuth()
  const { unreadCount } = useAnnouncementNotifications()
  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [culturalItems, setCulturalItems] = useState<CulturalItem[]>([])
  const [metrics, setMetrics] = useState({
    approvedEntries: 0,
    pendingReview: 0,
    contributors: 0,
    validationRate: 0,
  })
  const [leaderboardUser, setLeaderboardUser] = useState<LeaderboardProfile | null>(null)
  const [rewardItems, setRewardItems] = useState<RewardCatalogItem[]>([])

  const getTimeAgo = (date?: Date): string => {
    if (!date) return 'Recently'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  useEffect(() => {
    const run = async () => {
      try {
        let publicMetrics
        if (appUser?.role === 'admin' || appUser?.role === 'validator') {
          const snapshot = await getDashboardMetrics()
          publicMetrics = {
            approvedEntries: snapshot.approvedDictionaryEntries,
            pendingReview: snapshot.pendingContributions,
            contributors: snapshot.totalUsers,
            validationRate:
              snapshot.totalContributions > 0
                ? (snapshot.approvedContributions / snapshot.totalContributions) * 100
                : 0,
          }
          await setPublicDashboardMetrics({
            totalSubmissions: snapshot.totalContributions,
            approvedEntries: snapshot.approvedDictionaryEntries,
            pendingReview: snapshot.pendingContributions,
            activeContributors: snapshot.totalUsers,
            approvedMediaItems: snapshot.approvedUploads,
          })
        } else {
          const snapshot = await getPublicDashboardMetrics()
          publicMetrics = {
            approvedEntries: snapshot.approvedEntries,
            pendingReview: snapshot.pendingReview,
            contributors: snapshot.activeContributors,
            validationRate:
              snapshot.totalSubmissions > 0
                ? (snapshot.approvedEntries / snapshot.totalSubmissions) * 100
                : 0,
          }
        }
        setMetrics(publicMetrics)

        // Fetch recent uploads for activity feed
        const uploads = await listApprovedUploads()
        const recentActivities: ActivityItem[] = uploads.slice(0, 5).map((upload) => ({
          id: upload.id,
          type: upload.category.toLowerCase().includes('proverb') ? 'proverb' : 'upload',
          message: `New ${upload.category.toLowerCase()} uploaded: "${upload.title}"`,
          timestamp: getTimeAgo(upload.createdAt?.toDate()),
        }))
        setActivities(recentActivities)

        // Mock cultural items (would come from Firestore in production)
        setCulturalItems([
          {
            id: '1',
            type: 'proverb',
            title: 'Wisdom of the Elders',
            content: 'When the music changes, so does the dance.',
            attribution: 'Kasem Proverb',
          },
          {
            id: '2',
            type: 'fact',
            title: 'Kasem Language Facts',
            content: 'Kasem is a Gur language spoken by approximately 100,000 people in northern Ghana and Burkina Faso.',
            attribution: 'Indigen World Research',
          },
        ])

        // Fetch reward catalog items for threshold and next reward name
        try {
          const items = await listRewardCatalogItems()
          setRewardItems(items)
        } catch {
          console.error('Error loading reward catalog:')
        }

        // Rewards data will be set by the leaderboardUser subscription
      } catch (error) {
        console.error('Error loading homepage data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [appUser?.role, appUser])

  useEffect(() => {
    if (!appUser) {
      return () => undefined
    }

    const unsubscribe = subscribeToLeaderboard(
      'month',
      (entries) => {
        setLeaderboard(
          entries.slice(0, 4).map((entry) => ({
            rank: entry.rank,
            name: entry.displayName,
            points: entry.monthlyPoints,
            avatar: entry.photoURL,
          })),
        )
      },
      (error) => {
        console.error('Homepage leaderboard preview failed:', error)
        setLeaderboard([])
      },
    )

    return unsubscribe
  }, [appUser])

  useEffect(() => {
    if (!appUser) {
      return () => undefined
    }

    const unsubscribe = subscribeToLeaderboardUser(
      appUser.uid,
      (profile) => {
        setLeaderboardUser(profile)
      },
      (error) => {
        console.error('Homepage user profile subscription failed:', error)
        setLeaderboardUser(null)
      },
    )

    return unsubscribe
  }, [appUser])

  const rewards = useMemo(() => {
    const userPoints =
      leaderboardUser?.totalPoints ?? appUser?.totalPoints ?? 0

    if (userPoints === 0 && !leaderboardUser && !appUser) {
      return null
    }

    const nextReward = rewardItems
      .map((item) => ({ cost: item.cost, name: item.title }))
      .filter((item) => item.cost > userPoints)
      .sort((first, second) => first.cost - second.cost)[0]

    return {
      currentPoints: userPoints,
      pointsPerContribution: 10,
      threshold: nextReward?.cost ?? 100,
      nextRewardName: nextReward?.name ?? 'Airtime/Data Reward',
    }
  }, [leaderboardUser, appUser, rewardItems])

  const visibleLeaderboard = appUser ? leaderboard : []

  const initials =
    appUser?.displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PK'

  return (
    <section className="space-y-4 animate-fade-in pb-32 text-[#13271d] sm:space-y-6 md:space-y-8 md:pb-8">
      <div className="flex items-center justify-between md:hidden">
        <Link to="/" className="text-xl font-black text-kassena-green">
          <span className="bg-gradient-to-r from-kassena-green to-kassena-orange bg-clip-text text-transparent">
            TribeStudio
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/announcements"
            className="relative flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#ead9bd] bg-white text-kassena-green shadow-[0_10px_24px_rgba(71,44,18,0.08)]"
            aria-label="Open notifications"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M15.5 17h4l-1.2-1.5a2.5 2.5 0 0 1-.5-1.5v-3a5.8 5.8 0 0 0-11.6 0v3a2.5 2.5 0 0 1-.5 1.5L4.5 17h4" />
              <path d="M9.7 19a2.7 2.7 0 0 0 4.6 0" />
            </svg>
            <UnreadAnnouncementBadge
              count={unreadCount}
              className="absolute -right-1 -top-1 ring-white"
            />
          </Link>

          <Link
            to={appUser ? '/profile' : '/login'}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-kassena-green text-xs font-black text-white shadow-[0_10px_24px_rgba(71,44,18,0.12)] ring-2 ring-[#ead9bd]"
            aria-label={appUser ? 'Open profile' : 'Sign in'}
          >
            {appUser?.photoURL ? (
              <img
                src={appUser.photoURL}
                alt=""
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              initials
            )}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#0b4b2b] p-4 text-white shadow-[0_18px_42px_rgba(10,58,34,0.22)] sm:rounded-3xl sm:p-8 lg:p-12">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,transparent_0_42%,rgba(255,255,255,0.16)_42%_46%,transparent_46%_100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_18px)]" />
        <div className="relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#f5c84b] sm:text-sm">
              Kasem language platform
            </p>
            <h1 className="max-w-3xl text-[2rem] font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              <span className="sm:hidden">Kasem Language Hub</span>
              <span className="hidden sm:inline">
                The Digital Home of the Kasem Language
              </span>
            </h1>
            <p className="mt-3 text-base font-black text-kassena-cream sm:text-xl">
              Translate. Learn. Preserve.
            </p>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-kassena-cream/78 sm:text-base">
              Help build the world's first AI-ready Kasem language platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
            <Link
              to="/submit"
              className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-[16px] bg-gradient-to-r from-kassena-orange to-[#e67e22] px-4 py-3 text-sm font-black text-white shadow-lg transition-all hover:shadow-xl active:scale-95 sm:col-span-1 sm:rounded-full sm:px-6"
            >
              Submit Contribution
            </Link>
            <Link
              to="/dictionary"
              className="inline-flex min-h-11 items-center justify-center rounded-[15px] border border-white/18 bg-white/10 px-3 py-2.5 text-center text-xs font-black text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 sm:min-h-12 sm:rounded-full sm:px-6 sm:text-sm"
            >
              Browse Dictionary
            </Link>
            <Link
              to="/announcements"
              className="relative inline-flex min-h-11 items-center justify-center gap-2 rounded-[15px] border border-white/18 bg-white/10 px-3 py-2.5 text-center text-xs font-black text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 sm:min-h-12 sm:rounded-full sm:px-6 sm:text-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15.5 17h4l-1.2-1.5a2.5 2.5 0 0 1-.5-1.5v-3a5.8 5.8 0 0 0-11.6 0v3a2.5 2.5 0 0 1-.5 1.5L4.5 17h4" />
                <path d="M9.7 19a2.7 2.7 0 0 0 4.6 0" />
              </svg>
              Notifications
              <UnreadAnnouncementBadge
                count={unreadCount}
                className="absolute -right-1 -top-1 ring-kassena-green"
              />
            </Link>
            <a
              href="https://kassena.azlearner.me"
              target="_blank"
              rel="noreferrer noopener"
              className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-[15px] border border-white/12 bg-white/5 px-3 py-2.5 text-xs font-black text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 sm:col-span-1 sm:min-h-12 sm:rounded-full sm:px-6 sm:text-sm"
            >
              Our Mission
            </a>
          </div>
        </div>
      </div>

      {/* Search Bar - Primary CTA */}
      <div className="relative z-20">
        <SearchBar autoFocus={false} />
      </div>

      {/* Community Progress Dashboard */}
      <CommunityProgressDashboard
        approvedEntries={metrics.approvedEntries}
        pendingReview={metrics.pendingReview}
        contributors={metrics.contributors}
        validationRate={metrics.validationRate}
      />

      {/* Two-column layout for Rewards and Leaderboard */}
      <div className="grid gap-3 sm:gap-6 lg:grid-cols-2">
        <ContributorRewards data={rewards} isLoading={isLoading} />
        <LeaderboardPreview entries={visibleLeaderboard} isLoading={isLoading} />
      </div>

      {/* Community Activity Feed */}
      <CommunityActivityFeed activities={activities} isLoading={isLoading} />

      {/* Mission Carousel */}
      <MissionCarousel />

      {/* Cultural Spotlight */}
      <CulturalSpotlight items={culturalItems} isLoading={isLoading} />

      {/* App Name Footer */}
      <div className="text-center pt-4">
        <p className="text-sm text-slate-500">
          {APP_NAME}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Preserving language. Empowering communities.
        </p>
      </div>
    </section>
  )
}
