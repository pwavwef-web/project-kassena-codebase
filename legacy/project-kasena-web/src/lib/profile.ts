import type { AppUser } from '../types'

export const getUserDialects = (user?: AppUser | null): string[] => {
  if (!user) {
    return []
  }

  if (user.dialects?.length) {
    return user.dialects
  }

  return user.dialect ? [user.dialect] : []
}

export const isUserProfileComplete = (user?: AppUser | null): boolean =>
  Boolean(user?.displayName?.trim() && user?.community?.trim()) &&
  getUserDialects(user).length > 0
