import { useEffect, useMemo, useState } from 'react'
import {
  AchievementProfile,
  getAchievementStates,
  getAchievementSummary,
  persistAchievementUnlocks,
  readAchievementProfile,
  resetAchievementProfile,
  writeAchievementProfile,
} from '../lib/achievements'

type ProfileUpdater =
  | AchievementProfile
  | ((profile: AchievementProfile) => AchievementProfile)

export function useAchievementProfile() {
  const [profile, setProfile] = useState<AchievementProfile>(() =>
    readAchievementProfile(),
  )

  const achievementStates = useMemo(
    () => getAchievementStates(profile),
    [profile],
  )
  const summary = useMemo(
    () => getAchievementSummary(achievementStates),
    [achievementStates],
  )

  useEffect(() => {
    const nextProfile = persistAchievementUnlocks(profile, achievementStates)

    if (nextProfile !== profile) {
      setProfile(nextProfile)
    }
  }, [achievementStates, profile])

  const updateProfile = (updater: ProfileUpdater) => {
    setProfile((currentProfile) => {
      const nextProfile =
        typeof updater === 'function' ? updater(currentProfile) : updater

      return writeAchievementProfile(nextProfile)
    })
  }

  const resetProfile = () => {
    setProfile(resetAchievementProfile())
  }

  return {
    achievementStates,
    profile,
    resetProfile,
    summary,
    updateProfile,
  }
}
