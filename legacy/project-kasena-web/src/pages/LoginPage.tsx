import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AlertMessage } from '../components/common/AlertMessage'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { isUserProfileComplete } from '../lib/profile'

export const LoginPage = () => {
  const { appUser, firebaseUser, isLoading, signInWithGoogle } = useAuth()
  const [error, setError] = useState('')

  if (isLoading) {
    return <LoadingState message="Checking sign-in..." />
  }

  if (firebaseUser && !appUser) {
    return <LoadingState message="Loading signup details..." />
  }

  if (firebaseUser && appUser && !isUserProfileComplete(appUser)) {
    return <Navigate to="/complete-profile" replace />
  }

  if (firebaseUser) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Use your Google account to contribute safely to TribeStudio.
      </p>
      <button
        type="button"
        className="mt-5 rounded-lg bg-kassena-orange px-4 py-2 text-white"
        onClick={async () => {
          try {
            await signInWithGoogle()
          } catch {
            setError('Google sign-in failed. Please try again.')
          }
        }}
      >
        Sign in with Google
      </button>
      {error ? (
        <div className="mt-4">
          <AlertMessage type="error" message={error} />
        </div>
      ) : null}
    </section>
  )
}
