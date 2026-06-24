import { useMemo } from 'react'
import { useAuth } from './useAuth'

export const useUserRole = () => {
  const { role } = useAuth()

  return useMemo(
    () => ({
      role,
      isContributor: role === 'contributor',
      isValidator: role === 'validator',
      isAdmin: role === 'admin',
    }),
    [role],
  )
}
