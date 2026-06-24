import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isUserProfileComplete } from '../../lib/profile'
import { LoadingState } from './LoadingState'

export const ProtectedRoute = () => {
  const { appUser, firebaseUser, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState message="Checking authentication..." />
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />
  }

  if (!appUser) {
    return <LoadingState message="Loading signup details..." />
  }

  if (
    !isUserProfileComplete(appUser) &&
    location.pathname !== '/complete-profile'
  ) {
    return <Navigate to="/complete-profile" replace />
  }

  return <Outlet />
}

export const ValidatorRoute = () => {
  const { appUser, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />
  }

  if (!appUser) {
    return <Navigate to="/login" replace />
  }

  if (!isUserProfileComplete(appUser)) {
    return <Navigate to="/complete-profile" replace />
  }

  return appUser.role === 'validator' || appUser.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  )
}

export const AdminRoute = () => {
  const { appUser, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />
  }

  if (!appUser) {
    return <Navigate to="/login" replace />
  }

  return appUser.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  )
}
