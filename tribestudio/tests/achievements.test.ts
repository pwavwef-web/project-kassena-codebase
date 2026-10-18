import { describe, expect, it } from 'vitest'
import {
  ACHIEVEMENT_ASSET_AUDIT,
  ACHIEVEMENTS,
  DEFAULT_ACHIEVEMENT_PROFILE,
  getAchievementStates,
  type AchievementProfile,
} from '../src/lib/achievements'

const makeProfile = (
  overrides: Partial<AchievementProfile> = {},
): AchievementProfile => ({
  ...DEFAULT_ACHIEVEMENT_PROFILE,
  unlockedAchievementIds: [
    ...DEFAULT_ACHIEVEMENT_PROFILE.unlockedAchievementIds,
  ],
  ...overrides,
})

describe('TribeStudio achievements', () => {
  it('carries the full legacy badge catalogue and mapped assets', () => {
    expect(ACHIEVEMENTS).toHaveLength(30)
    expect(ACHIEVEMENT_ASSET_AUDIT).toMatchObject({
      total: 30,
      mapped: 30,
      missing: [],
    })
  })

  it('unlocks the three seeded demo badges from profile metrics', () => {
    const states = getAchievementStates(makeProfile())
    const unlockedIds = states
      .filter((state) => state.unlocked)
      .map((state) => state.id)

    expect(unlockedIds).toEqual([
      'first-word',
      'story-weaver',
      'dialect-guardian',
    ])
    expect(states.find((state) => state.id === 'rising-voice')).toMatchObject({
      progress: 80,
      progressText: '8 / 10',
      unlocked: false,
    })
  })

  it('keeps a badge unlocked once it is persisted on the profile', () => {
    const states = getAchievementStates(
      makeProfile({
        approvedContributions: 0,
        unlockedAchievementIds: ['rising-voice'],
      }),
    )

    expect(states.find((state) => state.id === 'rising-voice')).toMatchObject({
      progress: 100,
      progressText: 'Unlocked',
      unlocked: true,
    })
  })
})
