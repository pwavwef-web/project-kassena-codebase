import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DataCollectionProgress } from '../components/common/DataCollectionProgress'
import { APP_NAME, TAGLINE } from '../lib/constants'
import {
  getDashboardMetrics,
  listApprovedUploads,
  getPublicDashboardMetrics,
  setPublicDashboardMetrics,
} from '../lib/firestore.ts'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'
import type { UploadRecord } from '../types'

export const HomePage = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [recentCulture, setRecentCulture] = useState<UploadRecord[]>([])
  const [metrics, setMetrics] = useState({
    totalSubmissions: 0,
    approvedEntries: 0,
    pendingReview: 0,
    activeContributors: 0,
    approvedMediaItems: 0,
  })

  useEffect(() => {
    const run = async () => {
      const cultureItems = await listApprovedUploads().catch(() => [])
      setRecentCulture(cultureItems.slice(0, 3))

      if (appUser?.role === 'admin' || appUser?.role === 'validator') {
        const snapshot = await getDashboardMetrics()
        const publicMetrics = {
          totalSubmissions: snapshot.totalContributions,
          approvedEntries: snapshot.approvedDictionaryEntries,
          pendingReview: snapshot.pendingContributions,
          activeContributors: snapshot.totalUsers,
          approvedMediaItems: snapshot.approvedUploads,
        }

        await setPublicDashboardMetrics(publicMetrics)
        setMetrics(publicMetrics)
        setIsLoading(false)
        return
      }

      const snapshot = await getPublicDashboardMetrics()
      setMetrics({
        totalSubmissions: snapshot.totalSubmissions,
        approvedEntries: snapshot.approvedEntries,
        pendingReview: snapshot.pendingReview,
        activeContributors: snapshot.activeContributors,
        approvedMediaItems: snapshot.approvedMediaItems,
      })
      setIsLoading(false)
    }

    run().catch(() => setIsLoading(false))
  }, [appUser?.role])

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
          <Link
            to="/culture"
            className="rounded-lg border border-kassena-green px-4 py-2 text-kassena-green"
          >
            Explore Culture
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
          <article className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Published culture items</p>
            <p className="text-2xl font-bold text-kassena-green">
              {metrics.approvedMediaItems}
            </p>
          </article>
        </div>
      )}

      <DataCollectionProgress
        approved={metrics.approvedEntries}
        pending={metrics.pendingReview}
      />

      {recentCulture.length ? (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-kassena-green">
              Latest approved culture
            </h2>
            <Link
              to="/culture"
              className="text-sm font-semibold text-kassena-orange"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {recentCulture.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-kassena-cream p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.category}
                </p>
                <h3 className="mt-1 font-semibold text-kassena-green">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {item.description || 'Approved community archive item.'}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
