import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AchievementBadgeCard } from '../components/common/AchievementBadge'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'
import {
  ACHIEVEMENT_PROGRESS_EVENT,
  REGULAR_ACHIEVEMENT_COUNT,
  getAchievementStates,
  readAchievementProgress,
} from '../lib/achievements'
import {
  getLeaderboardRank,
  listCommunityLeaderboardProfiles,
  listUserContributions,
  listUserUploads,
  subscribeToLeaderboardUser,
} from '../lib/firestore'
import type {
  Contribution,
  LeaderboardProfile,
  RankedLeaderboardProfile,
  UploadRecord,
} from '../types'

type AchievementFilter = 'all' | 'unlocked' | 'locked'

const optionalFirebaseRead = async <T,>(
  loader: Promise<T>,
  fallback: T,
): Promise<T> => loader.catch(() => fallback)

const pointsForContribution = (contribution: Contribution): number =>
  50 + (contribution.englishExample || contribution.kasemExample ? 10 : 0)

const pointsForUpload = (upload: UploadRecord): number =>
  upload.status === 'approved' ? 100 : 0

const formatNumber = (value: number): string => value.toLocaleString()

export const AchievementsPage = () => {
  const { appUser } = useAuth()
  const navigate = useNavigate()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [uploads, setUploads] = useState<UploadRecord[]>([])
  const [regionalLeaderboard, setRegionalLeaderboard] = useState<
    RankedLeaderboardProfile[]
  >([])
  const [leaderboardUser, setLeaderboardUser] =
    useState<LeaderboardProfile | null>(null)
  const [currentRank, setCurrentRank] = useState<number | null>(null)
  const [filter, setFilter] = useState<AchievementFilter>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [, setClientProgressVersion] = useState(0)
  const appUserId = appUser?.uid ?? ''
  const appUserCommunity = appUser?.community ?? ''

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined
    }

    const handleProgressUpdate = () =>
      setClientProgressVersion((version) => version + 1)

    window.addEventListener(ACHIEVEMENT_PROGRESS_EVENT, handleProgressUpdate)

    return () => {
      window.removeEventListener(
        ACHIEVEMENT_PROGRESS_EVENT,
        handleProgressUpdate,
      )
    }
  }, [])

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      if (!appUserId) {
        return
      }

      setIsLoading(true)
      setDataError('')

      const [userContributions, userUploads, regionalProfiles] =
        await Promise.all([
          listUserContributions(appUserId),
          listUserUploads(appUserId),
          optionalFirebaseRead(
            listCommunityLeaderboardProfiles(appUserCommunity),
            [],
          ),
        ])

      if (active) {
        setContributions(userContributions)
        setUploads(userUploads)
        setRegionalLeaderboard(regionalProfiles)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setDataError('Achievement data could not be loaded from Firebase.')
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [appUserCommunity, appUserId])

  useEffect(() => {
    if (!appUser) {
      return () => undefined
    }

    return subscribeToLeaderboardUser(
      appUser.uid,
      setLeaderboardUser,
      () =>
        setDataError('Your points profile could not be loaded from Firebase.'),
    )
  }, [appUser])

  const fallbackPoints = useMemo(() => {
    const contributionPoints = contributions
      .filter((item) => item.status === 'approved')
      .reduce((total, contribution) => total + pointsForContribution(contribution), 0)
    const uploadPoints = uploads.reduce(
      (total, upload) => total + pointsForUpload(upload),
      0,
    )

    return contributionPoints + uploadPoints
  }, [contributions, uploads])

  const currentPoints =
    leaderboardUser?.totalPoints ?? appUser?.totalPoints ?? fallbackPoints

  useEffect(() => {
    let active = true

    if (!appUserId) {
      return () => {
        active = false
      }
    }

    getLeaderboardRank('allTime', currentPoints)
      .then((rank) => {
        if (active) {
          setCurrentRank(rank)
        }
      })
      .catch(() => {
        if (active) {
          setCurrentRank(null)
        }
      })

    return () => {
      active = false
    }
  }, [appUserId, currentPoints])

  const communityRank =
    regionalLeaderboard.find((entry) => entry.uid === appUser?.uid)?.rank ??
    (regionalLeaderboard.length
      ? regionalLeaderboard.filter((entry) => entry.totalPoints > currentPoints)
          .length + 1
      : null)
  const clientProgress = readAchievementProgress(appUserId)
  const achievementStates = useMemo(
    () =>
      getAchievementStates({
        clientProgress,
        communityRank,
        contributions,
        currentRank,
        uploads,
        user: appUser,
      }),
    [appUser, clientProgress, communityRank, contributions, currentRank, uploads],
  )
  const regularStates = achievementStates.filter((state) => !state.hidden)
  const hiddenUnlockedStates = achievementStates.filter((state) => state.hidden)
  const unlockedRegular = regularStates.filter((state) => state.unlocked)
  const lockedRegular = regularStates.filter((state) => !state.unlocked)
  const filteredRegularStates = regularStates.filter((state) => {
    if (filter === 'unlocked') {
      return state.unlocked
    }

    if (filter === 'locked') {
      return !state.unlocked
    }

    return true
  })

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/profile')
  }

  if (!appUser || isLoading) {
    return <LoadingState message="Loading achievements..." />
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <div className="overflow-hidden rounded-[26px] bg-[#143829] text-white shadow-[0_20px_48px_rgba(20,56,41,0.18)]">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="mb-5 rounded-full bg-white/12 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
            >
              Back
            </button>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f0bf3d]">
              Achievement Vault
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-5xl">
              Your Kasem Milestones
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/78 sm:text-base">
              Track the words, stories, audio, corrections, and learning habits
              you have contributed to the living Kasem archive.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[20px] bg-white/10 p-3 ring-1 ring-white/15">
            <div className="rounded-[16px] bg-white px-3 py-4 text-center text-[#143829]">
              <p className="text-2xl font-black">
                {formatNumber(unlockedRegular.length)}
              </p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-normal">
                Unlocked
              </p>
            </div>
            <div className="rounded-[16px] bg-[#f0bf3d] px-3 py-4 text-center text-[#143829]">
              <p className="text-2xl font-black">
                {formatNumber(lockedRegular.length)}
              </p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-normal">
                Locked
              </p>
            </div>
            <div className="rounded-[16px] bg-[#2c8f84] px-3 py-4 text-center text-white">
              <p className="text-2xl font-black">
                {formatNumber(hiddenUnlockedStates.length)}
              </p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-normal">
                Hidden
              </p>
            </div>
          </div>
        </div>
      </div>

      {dataError ? (
        <div className="rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {dataError}
        </div>
      ) : null}

      <section className="rounded-[22px] border border-[#ead9bd] bg-white/95 p-4 shadow-[0_14px_34px_rgba(71,44,18,0.08)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#143829]">
              All Achievements
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {formatNumber(unlockedRegular.length)} of{' '}
              {formatNumber(REGULAR_ACHIEVEMENT_COUNT)} regular badges unlocked
            </p>
          </div>

          <div className="flex rounded-full bg-[#f2eadc] p-1">
            {(['all', 'unlocked', 'locked'] as AchievementFilter[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-3 py-2 text-xs font-black capitalize transition ${
                    filter === item
                      ? 'bg-[#143829] text-white shadow-sm'
                      : 'text-[#143829]'
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredRegularStates.map((state) => (
            <AchievementBadgeCard key={state.id} state={state} />
          ))}
        </div>
      </section>

      {hiddenUnlockedStates.length ? (
        <section className="rounded-[22px] border border-[#1b3f31] bg-[#102d22] p-4 text-white shadow-[0_14px_34px_rgba(16,45,34,0.16)] sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f0bf3d]">
                Special Hidden Achievements
              </p>
              <h2 className="mt-1 text-lg font-black">
                Secrets You Have Unlocked
              </h2>
            </div>
            <Link
              to="/profile#achievements"
              className="text-sm font-black text-[#f0bf3d]"
            >
              Back to profile
            </Link>
          </div>

          <div className="mt-5 grid gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {hiddenUnlockedStates.map((state) => (
              <AchievementBadgeCard
                key={state.id}
                className="border-[#cfaa44] bg-[#fffaf0] text-[#143829]"
                state={state}
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
