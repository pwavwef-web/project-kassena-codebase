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
    <section className="space-y-8 animate-fade-in pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-kassena-green via-kassena-dark to-[#104022] p-8 text-white shadow-xl sm:p-12">
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-kassena-cream animate-slide-up">
            {APP_NAME}
          </h1>
          <p className="max-w-2xl text-lg font-medium text-kassena-cream/90 sm:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {TAGLINE}
          </p>
          <div className="flex flex-wrap gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/submit"
              className="rounded-full bg-gradient-to-r from-kassena-orange to-[#e67e22] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Submit Contribution
            </Link>
            <Link
              to="/dictionary"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Browse Dictionary
            </Link>
            <Link
              to="/culture"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95 hidden sm:inline-flex"
            >
              Explore Culture
            </Link>
            {appUser ? null : (
              <Link
                to="/login"
                className="rounded-full bg-kassena-gold px-6 py-3 text-sm font-bold text-kassena-dark shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Sign In
              </Link>
            )}
            <a
              href="https://kassena.azlearner.me"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              Learn More
            </a>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-kassena-orange/20 blur-3xl pointer-events-none"></div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Approved entries</p>
            <p className="mt-2 text-3xl font-bold text-kassena-green group-hover:text-kassena-orange transition-colors">
              {metrics.approvedEntries}
            </p>
          </article>
          <article className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Pending review</p>
            <p className="mt-2 text-3xl font-bold text-kassena-green group-hover:text-kassena-orange transition-colors">
              {metrics.pendingReview}
            </p>
          </article>
          <article className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Active contributors</p>
            <p className="mt-2 text-3xl font-bold text-kassena-green group-hover:text-kassena-orange transition-colors">
              {metrics.activeContributors}
            </p>
          </article>
          <article className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Culture items</p>
            <p className="mt-2 text-3xl font-bold text-kassena-green group-hover:text-kassena-orange transition-colors">
              {metrics.approvedMediaItems}
            </p>
          </article>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <DataCollectionProgress
          approved={metrics.approvedEntries}
          pending={metrics.pendingReview}
        />
      </div>

      {recentCulture.length ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-kassena-green">
              Latest Culture
            </h2>
            <Link
              to="/culture"
              className="text-sm font-bold text-kassena-orange hover:text-[#e67e22] transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentCulture.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex-1">
                  <span className="inline-flex items-center rounded-full bg-kassena-cream/50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-kassena-orange">
                    {item.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-kassena-green transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {item.description || 'Approved community archive item.'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
