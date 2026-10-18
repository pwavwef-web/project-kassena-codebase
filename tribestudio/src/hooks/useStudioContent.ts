import { useEffect, useState } from 'react'
import { ContentRecord } from '../data/studioData'
import { useAuth } from '../contexts/AuthContext'
import { studioService } from '../services/studioService'

interface StudioContentState {
  error: string | null
  loading: boolean
  records: ContentRecord[]
}

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to load contributor content.'

export function useStudioContent(): StudioContentState {
  const { user } = useAuth()
  const [state, setState] = useState<StudioContentState>({
    error: null,
    loading: false,
    records: [],
  })

  useEffect(() => {
    let active = true

    if (!user) {
      setState({ error: null, loading: false, records: [] })
      return undefined
    }

    setState((current) => ({ ...current, error: null, loading: true }))

    studioService
      .listContent()
      .then((records) => {
        if (active) {
          setState({ error: null, loading: false, records })
        }
      })
      .catch((error) => {
        if (active) {
          setState({ error: toErrorMessage(error), loading: false, records: [] })
        }
      })

    return () => {
      active = false
    }
  }, [user])

  return state
}
