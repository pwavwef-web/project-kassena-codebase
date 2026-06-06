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

        setLeaderboard([])

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
      setLeaderboard([])
      return () => undefined
    }

    const unsubscribe = subscribeToLeaderboard(
      'month',
      (entries) => {
        setLeaderboard(
          entries.slice(0, 5).map((entry) => ({
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

  return (
    <section className="space-y-8 animate-fade-in pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-kassena-green via-kassena-dark to-[#104022] p-8 text-white shadow-xl sm:p-12">
        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-kassena-cream animate-slide-up">
            The Digital Home of the Kasem Language
          </h1>
          <p className="max-w-2xl text-lg font-medium text-kassena-cream/90 sm:text-xl animate-slide-up-delayed">
            Translate. Learn. Preserve.
          </p>
          <p className="max-w-2xl text-sm text-kassena-cream/70 animate-slide-up-delayed-2">
            Help build the world's first AI-ready Kasem language platform.
          </p>
          <div className="flex flex-wrap gap-3 pt-4 animate-slide-up-delayed-3">
            <Link
              to="/submit"
              className="rounded-full bg-gradient-to-r from-kassena-orange to-[#e67e22] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Submit Contribution
            </Link>
            <Link
              to="/dictionary"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Browse Dictionary
            </Link>
            <Link
              to="/announcements"
              className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
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
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              Our Mission
            </a>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-kassena-orange/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Mission Carousel */}
      <MissionCarousel />

      {/* Search Bar - Primary CTA */}
      <div className="animate-slide-up-delayed-3">
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
      <div className="grid gap-6 lg:grid-cols-2">
        <ContributorRewards data={rewards} isLoading={isLoading} />
        <LeaderboardPreview entries={leaderboard} isLoading={isLoading} />
      </div>

      {/* Community Activity Feed */}
      <CommunityActivityFeed activities={activities} isLoading={isLoading} />

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
