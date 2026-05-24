import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
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
        role: defaultRole,
        status: 'active',
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
      await updateDoc(userRef, {
        displayName:
          user.displayName ?? snapshot.data().displayName ?? 'Contributor',
        email: user.email ?? snapshot.data().email ?? '',
        photoURL: user.photoURL ?? snapshot.data().photoURL ?? '',
        lastLoginAt: serverTimestamp(),
      })
    }

    const refreshed = await getDoc(userRef)
    if (refreshed.exists()) {
      setAppUser(refreshed.data() as AppUser)
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

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase environment variables are missing.')
    }
    if (!auth) {
      throw new Error('Firebase Auth is unavailable.')
    }

    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    if (!auth) {
      return
    }

    await signOut(auth)
    setAppUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      appUser,
      role: appUser?.role ?? defaultRole,
      isLoading,
      signInWithGoogle,
      logout,
    }),
    [appUser, firebaseUser, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
