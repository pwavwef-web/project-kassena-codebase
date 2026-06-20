import { useEffect, useState } from 'react'
import {
  getCampaignMetrics,
  getPublicDashboardMetrics,
} from '../../lib/firestore'
import { isFirebaseConfigured } from '../../config/firebase'
import type { CampaignMetrics, PublicDashboardMetrics } from '../../types'

export interface PublicStatsState {
  dashboard: PublicDashboardMetrics | null
  campaign: CampaignMetrics | null
  loading: boolean
  /** True if live data could not be loaded — UI should fall back to targets. */
  unavailable: boolean
}

/**
 * Loads public, read-allowed Firestore stats for the marketing site. Fails
 * gracefully: on any error or missing config, `unavailable` is true and callers
 * show clearly-labelled targets instead of fabricated numbers.
 */
export const usePublicStats = (): PublicStatsState => {
  // Lazy initial state: when Firebase isn't configured we start already-resolved
  // and unavailable, avoiding a synchronous setState inside the effect.
  const [state, setState] = useState<PublicStatsState>(() => ({
    dashboard: null,
    campaign: null,
    loading: isFirebaseConfigured,
    unavailable: !isFirebaseConfigured,
  }))

  useEffect(() => {
    if (!isFirebaseConfigured) return
    let active = true

    Promise.allSettled([getPublicDashboardMetrics(), getCampaignMetrics()])
      .then(([dashboardResult, campaignResult]) => {
        if (!active) return
        const dashboard =
          dashboardResult.status === 'fulfilled' ? dashboardResult.value : null
        const campaign =
          campaignResult.status === 'fulfilled' ? campaignResult.value : null
        setState({
          dashboard,
          campaign,
          loading: false,
          unavailable: !dashboard && !campaign,
        })
      })
      .catch(() => {
        if (!active) return
        setState({
          dashboard: null,
          campaign: null,
          loading: false,
          unavailable: true,
        })
      })

    return () => {
      active = false
    }
  }, [])

  return state
}
