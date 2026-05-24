import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingState } from './LoadingState'

export const ProtectedRoute = () => {
  const { firebaseUser, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState message="Checking authentication..." />
  }

  return firebaseUser ? <Outlet /> : <Navigate to="/login" replace />
}

export const ValidatorRoute = () => {
  const { appUser, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />
  }

  if (!appUser) {
    return <Navigate to="/login" replace />
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
