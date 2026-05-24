import { useEffect, useState } from 'react'
import { DataCollectionProgress } from '../../components/common/DataCollectionProgress'
import { LoadingState } from '../../components/common/LoadingState'
import { TestRunChecklist } from '../../components/common/TestRunChecklist'
import { toDateLabel } from '../../lib/date'
import {
  getDashboardMetrics,
  getRecentContributions,
} from '../../lib/firestore'
import type { Contribution, DashboardMetrics } from '../../types'

const defaultMetrics: DashboardMetrics = {
  totalUsers: 0,
  totalContributions: 0,
  pendingContributions: 0,
  approvedContributions: 0,
  rejectedContributions: 0,
  totalUploads: 0,
  pendingUploads: 0,
  approvedUploads: 0,
  approvedDictionaryEntries: 0,
}

export const AdminDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [recent, setRecent] = useState<Contribution[]>([])

  useEffect(() => {
    Promise.all([getDashboardMetrics(), getRecentContributions()])
      .then(([metricData, recentData]) => {
        setMetrics(metricData)
        setRecent(recentData)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total users', metrics.totalUsers],
          ['Total contributions', metrics.totalContributions],
          ['Pending contributions', metrics.pendingContributions],
          ['Approved contributions', metrics.approvedContributions],
          ['Rejected contributions', metrics.rejectedContributions],
          ['Total uploads', metrics.totalUploads],
          ['Pending uploads', metrics.pendingUploads],
          ['Published media items', metrics.approvedUploads],
          ['Approved dictionary entries', metrics.approvedDictionaryEntries],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-kassena-green">{value}</p>
          </article>
        ))}
      </div>

      <DataCollectionProgress
        approved={metrics.approvedDictionaryEntries}
        pending={metrics.pendingContributions}
      />

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-kassena-green">
          Recent submissions
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          {recent.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-kassena-cream p-3"
            >
              <p className="font-medium text-kassena-green">
                {item.englishText} — {item.kasemText}
              </p>
              <p className="text-slate-600">
                {item.contributorName} • {toDateLabel(item.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <TestRunChecklist />
    </div>
  )
}
