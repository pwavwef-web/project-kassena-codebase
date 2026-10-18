import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  DocumentData,
  FirestoreError,
  Timestamp,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db, firebaseConfigStatus } from '../lib/firebase'

export interface StudioUserProfile {
  uid: string
  displayName: string
  email: string
  role: string
  status: string
  interests: string[]
  communities: string[]
  languages: string[]
  expertise: string[]
  consentAcknowledged: boolean
  privacy: {
    showDisplayName: boolean
    showBadges: boolean
  }
  createdAt: string | null
  updatedAt: string | null
}

export interface ContributorProfileInput {
  interests: string[]
  communities: string[]
  languages: string[]
  expertise: string[]
  consentAcknowledged: boolean
  privacy: {
    showDisplayName: boolean
    showBadges: boolean
  }
}

interface AuthContextValue {
  error: string | null
  firebaseReady: boolean
  loading: boolean
  profile: StudioUserProfile | null
  refreshProfile: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateContributorProfile: (input: ContributorProfileInput) => Promise<void>
  user: User | null
}

const missingConfigMessage = `Firebase is not configured. Missing ${firebaseConfigStatus.missingKeys.join(', ')}.`

const defaultContext: AuthContextValue = {
  error: null,
  firebaseReady: firebaseConfigStatus.isConfigured,
  loading: false,
  profile: null,
  refreshProfile: async () => undefined,
  signInWithGoogle: async () => {
    throw new Error(missingConfigMessage)
  },
  signOut: async () => undefined,
  updateContributorProfile: async () => {
    throw new Error(missingConfigMessage)
  },
  user: null,
}

const AuthContext = createContext<AuthContextValue>(defaultContext)

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toStringValue = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback

const toStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []

const toDateString = (value: unknown): string | null => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString()
  }

  return null
}

const toAuthErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  if (isRecord(error) && typeof error.message === 'string') {
    return error.message
  }

  return 'The Firebase request could not be completed.'
}

const getDisplayName = (user: User): string =>
  user.displayName || user.email?.split('@')[0] || 'TribeStudio Contributor'

const getEmail = (user: User): string =>
  user.email || `unknown-${user.uid.slice(0, 12)}@tribestudio.local`

const normalizePrivacy = (value: unknown): StudioUserProfile['privacy'] => {
  if (!isRecord(value)) {
    return { showDisplayName: true, showBadges: true }
  }

  return {
    showDisplayName:
      typeof value.showDisplayName === 'boolean' ? value.showDisplayName : true,
    showBadges: typeof value.showBadges === 'boolean' ? value.showBadges : true,
  }
}

const profileDefaults = (): ContributorProfileInput => ({
  interests: [],
  communities: ['Kasem / Kasena'],
  languages: ['Kasem'],
  expertise: [],
  consentAcknowledged: false,
  privacy: { showDisplayName: true, showBadges: true },
})

const buildStudioUserProfile = (
  user: User,
  userData: DocumentData | undefined,
  profileData: DocumentData | undefined,
): StudioUserProfile => {
  const defaults = profileDefaults()

  return {
    uid: user.uid,
    displayName: toStringValue(userData?.displayName, getDisplayName(user)),
    email: toStringValue(userData?.email, getEmail(user)),
    role: toStringValue(userData?.role, 'user'),
    status: toStringValue(userData?.status, 'active'),
    interests: toStringList(profileData?.interests),
    communities: toStringList(profileData?.communities).length
      ? toStringList(profileData?.communities)
      : defaults.communities,
    languages: toStringList(profileData?.languages).length
      ? toStringList(profileData?.languages)
      : defaults.languages,
    expertise: toStringList(profileData?.expertise),
    consentAcknowledged:
      typeof profileData?.consentAcknowledged === 'boolean'
        ? profileData.consentAcknowledged
        : defaults.consentAcknowledged,
    privacy: normalizePrivacy(profileData?.privacy),
    createdAt: toDateString(profileData?.createdAt) ?? toDateString(userData?.createdAt),
    updatedAt: toDateString(profileData?.updatedAt) ?? toDateString(userData?.updatedAt),
  }
}

async function syncFirebaseUserProfile(user: User): Promise<StudioUserProfile> {
  if (!db) {
    throw new Error(missingConfigMessage)
  }

  const userRef = doc(db, 'users', user.uid)
  const profileRef = doc(db, 'profiles', user.uid)

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef)
    const profileSnapshot = await transaction.get(profileRef)
    const existingUser = userSnapshot.data()
    const existingProfile = profileSnapshot.data()
    const defaults = profileDefaults()

    transaction.set(userRef, {
      uid: user.uid,
      displayName: getDisplayName(user),
      email: getEmail(user),
      role: toStringValue(existingUser?.role, 'user'),
      status: toStringValue(existingUser?.status, 'active'),
      createdAt: existingUser?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    transaction.set(profileRef, {
      uid: user.uid,
      interests: toStringList(existingProfile?.interests),
      communities: toStringList(existingProfile?.communities).length
        ? toStringList(existingProfile?.communities)
        : defaults.communities,
      languages: toStringList(existingProfile?.languages).length
        ? toStringList(existingProfile?.languages)
        : defaults.languages,
      expertise: toStringList(existingProfile?.expertise),
      privacy: normalizePrivacy(existingProfile?.privacy),
      consentAcknowledged:
        typeof existingProfile?.consentAcknowledged === 'boolean'
          ? existingProfile.consentAcknowledged
          : defaults.consentAcknowledged,
      createdAt: existingProfile?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })

  return loadStudioUserProfile(user)
}

async function loadStudioUserProfile(user: User): Promise<StudioUserProfile> {
  if (!db) {
    throw new Error(missingConfigMessage)
  }

  const [userSnapshot, profileSnapshot] = await Promise.all([
    getDoc(doc(db, 'users', user.uid)),
    getDoc(doc(db, 'profiles', user.uid)),
  ])

  return buildStudioUserProfile(
    user,
    userSnapshot.data(),
    profileSnapshot.data(),
  )
}

async function saveContributorProfile(
  user: User,
  input: ContributorProfileInput,
): Promise<StudioUserProfile> {
  if (!db) {
    throw new Error(missingConfigMessage)
  }

  const profileRef = doc(db, 'profiles', user.uid)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef)
    const existingProfile = snapshot.data()

    transaction.set(profileRef, {
      uid: user.uid,
      interests: input.interests,
      communities: input.communities,
      languages: input.languages,
      expertise: input.expertise,
      privacy: input.privacy,
      consentAcknowledged: input.consentAcknowledged,
      createdAt: existingProfile?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })

  return loadStudioUserProfile(user)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<StudioUserProfile | null>(null)
  const [loading, setLoading] = useState(firebaseConfigStatus.isConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return undefined
    }

    let active = true

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) {
        return
      }

      setUser(nextUser)
      setError(null)

      if (!nextUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const nextProfile = await syncFirebaseUserProfile(nextUser)
        if (active) {
          setProfile(nextProfile)
        }
      } catch (profileError) {
        if (active) {
          setError(toAuthErrorMessage(profileError as FirestoreError))
          setProfile(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      throw new Error(missingConfigMessage)
    }

    setError(null)
    await signInWithPopup(auth, provider)
  }, [])

  const signOut = useCallback(async () => {
    if (!auth) {
      return
    }

    setError(null)
    await firebaseSignOut(auth)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return
    }

    setProfile(await loadStudioUserProfile(user))
  }, [user])

  const updateContributorProfile = useCallback(
    async (input: ContributorProfileInput) => {
      if (!user) {
        throw new Error('Sign in with Google before updating your contributor profile.')
      }

      setError(null)
      setProfile(await saveContributorProfile(user, input))
    },
    [user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      error,
      firebaseReady: firebaseConfigStatus.isConfigured,
      loading,
      profile,
      refreshProfile,
      signInWithGoogle,
      signOut,
      updateContributorProfile,
      user,
    }),
    [
      error,
      loading,
      profile,
      refreshProfile,
      signInWithGoogle,
      signOut,
      updateContributorProfile,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
