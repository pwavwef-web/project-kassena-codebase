import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  auth,
  db,
  googleProvider,
  isFirebaseConfigured,
} from '../config/firebase'
import { getBadgeTitleForPoints } from '../lib/firestore'
import { getDisplayRankTitleForProfile } from '../lib/ranks'
import type { AppUser, UserRole } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContextValue'

const defaultRole: UserRole = 'contributor'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured)

  const hydrateUserRecord = useCallback(async (user: User) => {
    const userRef = doc(db, 'users', user.uid)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName ?? 'Contributor',
        email: user.email ?? '',
        photoURL: user.photoURL ?? '',
        totalPoints: 0,
        weeklyPoints: 0,
        monthlyPoints: 0,
        approvedEntries: 0,
        approvedSubmissions: 0,
        reviewedSubmissions: 0,
        approvalRate: 0,
        trustScore: 0,
        approvedExampleSentences: 0,
        approvedCulturalContributions: 0,
        contributedDialects: [],
        uniqueDialects: 0,
        badgeTitle: getBadgeTitleForPoints(0),
        lastContributionAt: null,
        role: defaultRole,
        staffRank: '',
        status: 'active',
        community: '',
        dialect: '',
        dialects: [],
        phone: '',
        bio: '',
        contributionFocus: '',
        kasemKeyboard: {
          smartTypingEnabled: false,
        },
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      })

      await setDoc(
        doc(db, 'publicStats', 'overview'),
        {
          activeContributors: increment(1),
        },
        { merge: true },
      )
    } else {
      const existing = snapshot.data()
      await updateDoc(userRef, {
        uid: user.uid,
        displayName: existing.displayName || user.displayName || 'Contributor',
        email: user.email ?? existing.email ?? '',
        photoURL: existing.photoURL || user.photoURL || '',
        community: existing.community ?? '',
        dialect: existing.dialect ?? '',
        dialects:
          existing.dialects ?? (existing.dialect ? [existing.dialect] : []),
        totalPoints: existing.totalPoints ?? 0,
        weeklyPoints: existing.weeklyPoints ?? 0,
        monthlyPoints: existing.monthlyPoints ?? 0,
        approvedEntries: existing.approvedEntries ?? 0,
        approvedSubmissions:
          existing.approvedSubmissions ?? existing.approvedEntries ?? 0,
        reviewedSubmissions: existing.reviewedSubmissions ?? 0,
        approvalRate: existing.approvalRate ?? 0,
        trustScore: existing.trustScore ?? 0,
        approvedExampleSentences: existing.approvedExampleSentences ?? 0,
        approvedCulturalContributions:
          existing.approvedCulturalContributions ?? 0,
        contributedDialects: existing.contributedDialects ?? [],
        uniqueDialects:
          existing.uniqueDialects ??
          existing.contributedDialects?.length ??
          existing.dialects?.length ??
          0,
        badgeTitle:
          existing.badgeTitle ??
          getBadgeTitleForPoints(existing.totalPoints ?? 0),
        staffRank: existing.staffRank ?? '',
        lastContributionAt: existing.lastContributionAt ?? null,
        phone: existing.phone ?? '',
        bio: existing.bio ?? '',
        contributionFocus: existing.contributionFocus ?? '',
        kasemKeyboard: existing.kasemKeyboard ?? {
          smartTypingEnabled: false,
        },
        lastLoginAt: serverTimestamp(),
      })
    }

    const refreshed = await getDoc(userRef)
    if (refreshed.exists()) {
      const refreshedData = refreshed.data() as AppUser
      setAppUser({
        ...refreshedData,
        uid: user.uid,
        badgeTitle: getDisplayRankTitleForProfile(refreshedData),
      })
    }
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return () => undefined
    }
    if (!auth) {
      return () => undefined
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setFirebaseUser(user)

      if (user) {
        await hydrateUserRecord(user)
      } else {
        setAppUser(null)
      }

      setIsLoading(false)
    })

    return unsubscribe
  }, [hydrateUserRecord])

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase environment variables are missing.')
    }
    if (!auth) {
      throw new Error('Firebase Auth is unavailable.')
    }

    await signInWithPopup(auth, googleProvider)
  }, [])

  const updateUserProfile = useCallback(
    async (
      updates: Pick<
        AppUser,
        | 'displayName'
        | 'photoURL'
        | 'community'
        | 'dialect'
        | 'dialects'
        | 'phone'
        | 'bio'
        | 'contributionFocus'
      >,
    ) => {
      if (!firebaseUser || !appUser) {
        throw new Error('Please sign in before editing your profile.')
      }

      const normalized = {
        displayName: updates.displayName.trim() || 'Contributor',
        photoURL: updates.photoURL.trim(),
        community: updates.community?.trim() ?? '',
        dialect: updates.dialects?.[0] ?? updates.dialect?.trim() ?? '',
        dialects: updates.dialects ?? [],
        phone: updates.phone?.trim() ?? '',
        bio: updates.bio?.trim() ?? '',
        contributionFocus: updates.contributionFocus?.trim() ?? '',
      }

      await updateFirebaseProfile(firebaseUser, {
        displayName: normalized.displayName,
        photoURL: normalized.photoURL || null,
      })

      await updateDoc(doc(db, 'users', appUser.uid), {
        ...normalized,
        updatedAt: serverTimestamp(),
      })

      setAppUser((current) =>
        current
          ? {
              ...current,
              ...normalized,
            }
          : current,
      )
    },
    [appUser, firebaseUser],
  )

  const logout = useCallback(async () => {
    if (!auth) {
      return
    }

    await signOut(auth)
    setAppUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      appUser,
      role: appUser?.role ?? defaultRole,
      isLoading,
      signInWithGoogle,
      updateUserProfile,
      logout,
    }),
    [
      appUser,
      firebaseUser,
      isLoading,
      logout,
      signInWithGoogle,
      updateUserProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
