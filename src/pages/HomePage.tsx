import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DataCollectionProgress } from '../components/common/DataCollectionProgress'
import { APP_NAME, TAGLINE } from '../lib/constants'
import { getDashboardMetrics } from '../lib/firestore'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'

export const HomePage = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalSubmissions: 0,
    approvedEntries: 0,
    pendingReview: 0,
    activeContributors: 0,
  })

  useEffect(() => {
    const run = async () => {
      const snapshot = await getDashboardMetrics()
      setMetrics({
        totalSubmissions: snapshot.totalContributions,
        approvedEntries: snapshot.approvedDictionaryEntries,
        pendingReview: snapshot.pendingContributions,
        activeContributors: snapshot.totalUsers,
      })
      setIsLoading(false)
    }

    run().catch(() => setIsLoading(false))
  }, [])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-kassena-green">{APP_NAME}</h1>
        <p className="mt-2 text-lg text-kassena-orange">{TAGLINE}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/submit"
            className="rounded-lg bg-kassena-orange px-4 py-2 text-white"
          >
            Submit a Contribution
          </Link>
          <Link
            to="/dictionary"
            className="rounded-lg bg-kassena-green px-4 py-2 text-white"
          >
            Browse Dictionary
          </Link>
          {appUser ? null : (
            <Link
              to="/login"
              className="rounded-lg border border-kassena-gold px-4 py-2 text-kassena-green"
            >
              Sign in with Google
            </Link>
          )}
          <a
            href="https://kassena.azlearner.me"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-kassena-green px-4 py-2 text-kassena-green"
          >
            Learn more and docs
          </a>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total submissions</p>
            <p className="text-2xl font-bold text-kassena-green">
              {metrics.totalSubmissions}
            </p>
          </article>
          <article className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Approved entries</p>
            <p className="text-2xl font-bold text-kassena-green">
              {metrics.approvedEntries}
            </p>
          </article>
          <article className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Pending review</p>
            <p className="text-2xl font-bold text-kassena-green">
              {metrics.pendingReview}
            </p>
          </article>
          <article className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Active contributors</p>
            <p className="text-2xl font-bold text-kassena-green">
              {metrics.activeContributors}
            </p>
          </article>
        </div>
      )}

      <DataCollectionProgress
        approved={metrics.approvedEntries}
        pending={metrics.pendingReview}
      />
    </section>
  )
}
