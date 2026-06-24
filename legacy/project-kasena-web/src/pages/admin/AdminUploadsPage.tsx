import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { MediaPreview } from '../../components/common/MediaPreview'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAuth } from '../../hooks/useAuth'
import { listUploads, reviewUpload } from '../../lib/firestore.ts'
import type { UploadRecord } from '../../types'

export const AdminUploadsPage = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [records, setRecords] = useState<UploadRecord[]>([])
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('pending')

  const load = async () => {
    setRecords(await listUploads())
  }

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const uploads = await listUploads()
      if (active) {
        setRecords(uploads)
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

  const actor = { id: appUser?.uid ?? '', email: appUser?.email ?? '' }

  const filtered = useMemo(
    () =>
      records.filter(
        (item) => statusFilter === 'all' || item.status === statusFilter,
      ),
    [records, statusFilter],
  )

  const handleReview = async (
    uploadId: string,
    status: 'approved' | 'rejected',
  ) => {
    const note =
      window.prompt(
        'Review note',
        status === 'approved' ? 'Approved' : 'Not approved',
      ) ?? ''
    await reviewUpload(uploadId, status, note, actor)
    await load()
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">Upload Review</h1>
      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as typeof statusFilter)
        }
        aria-label="Filter uploads by status"
        className="rounded-lg border border-kassena-cream px-3 py-2"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      {isLoading ? (
        <LoadingState />
      ) : filtered.length ? (
        <div className="space-y-3">
          {filtered.map((record) => (
            <article
              key={record.id}
              className="rounded-lg border border-kassena-cream p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-kassena-green">
                  {record.title}
                </h2>
                <StatusBadge status={record.status} />
              </div>
              <p className="text-sm text-slate-600">{record.category}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                {record.dialect ? <span>{record.dialect}</span> : null}
                {record.consentStatus ? (
                  <span>{record.consentStatus.replace('_', ' ')}</span>
                ) : null}
                {record.culturalSensitivity ? (
                  <span>{record.culturalSensitivity.replace('_', ' ')}</span>
                ) : null}
                {record.tags ? <span>{record.tags}</span> : null}
              </div>
              <MediaPreview
                className="mt-3"
                file={{
                  name: record.fileName,
                  url: record.fileUrl,
                  contentType: record.contentType,
                }}
                title={record.title}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  className="rounded-lg border border-kassena-gold px-3 py-1 text-sm text-kassena-green"
                  href={record.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View file
                </a>
                <button
                  type="button"
                  onClick={() => handleReview(record.id, 'approved')}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReview(record.id, 'rejected')}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-sm text-white"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No uploads found for this filter." />
      )}
    </section>
  )
}
