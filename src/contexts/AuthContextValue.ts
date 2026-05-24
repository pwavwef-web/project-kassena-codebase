import { createContext } from 'react'
import type { User } from 'firebase/auth'
import type { AppUser, UserRole } from '../types'

export interface AuthContextValue {
  firebaseUser: User | null
  appUser: AppUser | null
  role: UserRole
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
