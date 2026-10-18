export const studioFeatureFlags = {
  googleAuth: true,
  firestoreContributions: true,
  payments: false,
  aiCalls: false,
  blazeServices: false,
} as const

export type StudioFeatureFlag = keyof typeof studioFeatureFlags
