import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { MediaPreview } from '../../components/common/MediaPreview'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAuth } from '../../hooks/useAuth'
import {
  approveContribution,
  listContributions,
  rejectContribution,
} from '../../lib/firestore.ts'
import type { Contribution } from '../../types'

export const AdminSubmissionsPage = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [submissions, setSubmissions] = useState<Contribution[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('pending')

  const loadSubmissions = async () => {
    setSubmissions(await listContributions())
  }

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const contributionData = await listContributions()

      if (active) {
        setSubmissions(contributionData)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((submission) => {
        const keyword = search.trim().toLowerCase()
        const matchesStatus =
          statusFilter === 'all' || submission.status === statusFilter

        if (!matchesStatus) {
          return false
        }

        if (!keyword) {
          return true
        }

        return (
          submission.status.toLowerCase().includes(keyword) ||
          submission.englishText.toLowerCase().includes(keyword) ||
          submission.kasemText.toLowerCase().includes(keyword) ||
          submission.alternateKasemTerms?.toLowerCase().includes(keyword) ||
          submission.dialect.toLowerCase().includes(keyword) ||
          submission.category.toLowerCase().includes(keyword) ||
          submission.contributorName.toLowerCase().includes(keyword) ||
          submission.contributionType?.toLowerCase().includes(keyword) ||
          submission.selectedBountyTitle?.toLowerCase().includes(keyword) ||
          submission.voiceRecordings?.some(
            (recording) =>
              recording.label.toLowerCase().includes(keyword) ||
              recording.fileName.toLowerCase().includes(keyword),
          ) ||
          submission.attachedFiles?.some(
            (file) =>
              file.name.toLowerCase().includes(keyword) ||
              file.contentType?.toLowerCase().includes(keyword),
          )
        )
      }),
    [search, statusFilter, submissions],
  )

  const actor = { id: appUser?.uid ?? '', email: appUser?.email ?? '' }

  const handleApprove = async (id: string) => {
    if (!actor.id) {
      return
    }

    await approveContribution(id, actor)
    await loadSubmissions()
  }

  const handleReject = async (id: string) => {
    if (!actor.id) {
      return
    }

    const reviewNotes =
      window.prompt('Add rejection note', 'Needs more context') ?? ''
    await rejectContribution(id, actor, reviewNotes)
    await loadSubmissions()
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">
        Contribution Review
      </h1>
      <div className="grid gap-3 md:grid-cols-[1fr_160px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by status, dialect, category or contributor"
          aria-label="Search submissions"
          className="rounded-lg border border-kassena-cream px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as typeof statusFilter)
          }
          aria-label="Filter submissions by status"
          className="rounded-lg border border-kassena-cream px-3 py-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : filteredSubmissions.length ? (
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => (
            <article
              key={submission.id}
              className="rounded-lg border border-kassena-cream p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-kassena-green">
                  {submission.englishText} — {submission.kasemText}
                </h2>
                <StatusBadge status={submission.status} />
              </div>
              <p className="text-sm text-slate-600">
                {submission.dialect} • {submission.category} •{' '}
                {submission.contributorName}
              </p>
              {submission.contributionType ? (
                <p className="mt-2 inline-flex rounded-full bg-kassena-bg px-3 py-1 text-xs font-bold text-kassena-green ring-1 ring-kassena-cream">
                  Type: {submission.contributionType}
                </p>
              ) : null}
              {submission.selectedBountyTitle ? (
                <p className="ml-2 mt-2 inline-flex rounded-full bg-[#fff8ed] px-3 py-1 text-xs font-bold text-kassena-orange ring-1 ring-kassena-cream">
                  Campaign: {submission.selectedBountyTitle}
                </p>
              ) : null}
              {submission.alternateKasemTerms ? (
                <p className="mt-2 text-sm text-slate-700">
                  Other Kasem forms: {submission.alternateKasemTerms}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-slate-700">
                {submission.notes || 'No notes provided'}
              </p>
              {submission.voiceRecordings?.length ? (
                <div className="mt-3 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Voice recordings
                  </p>
                  {submission.voiceRecordings.map((recording) => (
                    <MediaPreview
                      key={recording.storagePath || recording.url}
                      compact
                      file={{
                        name: recording.fileName,
                        url: recording.url,
                        contentType: recording.contentType,
                      }}
                      title={recording.label}
                    />
                  ))}
                </div>
              ) : null}
              {submission.attachedFiles?.length ? (
                <div className="mt-3 space-y-3">
                  {submission.attachedFiles.map((file) => (
                    <MediaPreview
                      key={file.storagePath || file.url || file.name}
                      compact
                      file={{
                        name: file.name,
                        url: file.url,
                        contentType: file.contentType,
                      }}
                      title={`${submission.englishText} attachment`}
                    />
                  ))}
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white"
                  onClick={() => handleApprove(submission.id)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white"
                  onClick={() => handleReject(submission.id)}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-kassena-gold px-3 py-1.5 text-sm text-kassena-green"
                  onClick={() => handleReject(submission.id)}
                >
                  Send back for review
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No submissions match the current filters." />
      )}
    </section>
  )
}
