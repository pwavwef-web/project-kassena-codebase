import { useEffect, useState } from 'react'
import { AlertMessage } from '../components/common/AlertMessage'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { MediaPreview } from '../components/common/MediaPreview'
import { StatusBadge } from '../components/common/StatusBadge'
import {
  UploadForm,
  type UploadFormValues,
} from '../components/forms/UploadForm'
import { useAuth } from '../hooks/useAuth'
import {
  createUploadRecord,
  listUploads,
  listUserUploads,
} from '../lib/firestore.ts'
import { uploadGeneralFile } from '../lib/storage'
import type { UploadRecord } from '../types'

export const UploadsPage = () => {
  const { appUser, firebaseUser } = useAuth()
  const [records, setRecords] = useState<UploadRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const loadUploads = async () => {
    if (!appUser) {
      setRecords([])
      return
    }

    const uploaded =
      appUser.role === 'contributor'
        ? await listUserUploads(appUser.uid)
        : await listUploads()
    setRecords(uploaded)
  }

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      if (!appUser) {
        if (active) {
          setIsLoading(false)
        }
        return
      }

      const uploaded =
        appUser.role === 'contributor'
          ? await listUserUploads(appUser.uid)
          : await listUploads()
      if (active) {
        setRecords(uploaded)
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
  }, [appUser])

  const handleSubmit = async (values: UploadFormValues) => {
    if (!appUser || !firebaseUser || !values.file) {
      setFeedback({
        type: 'error',
        message: 'Please sign in and choose a file.',
      })
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const uploadId = crypto.randomUUID()
      const file = await uploadGeneralFile(
        firebaseUser.uid,
        uploadId,
        values.file,
      )

      await createUploadRecord({
        title: values.title,
        description: values.description,
        category: values.category,
        dialect: values.dialect,
        consentStatus: values.consentStatus,
        culturalSensitivity: values.culturalSensitivity,
        tags: values.tags,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        storagePath: file.storagePath,
        contentType: file.contentType,
        size: file.size,
        uploadedBy: appUser.uid,
        uploadedByName: appUser.displayName,
        status: 'pending',
        reviewedBy: null,
        reviewNotes: '',
      })

      await loadUploads()
      setFeedback({ type: 'success', message: 'Upload submitted for review.' })
    } catch {
      setFeedback({
        type: 'error',
        message: 'Upload failed. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const visibleRecords = records.filter(
    (record) =>
      appUser?.role !== 'contributor' || record.uploadedBy === appUser.uid,
  )

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-kassena-green">Uploads</h1>
        <p className="text-sm text-slate-600">
          Upload corpus and supporting files for review.
        </p>
        {feedback ? (
          <div className="mt-4">
            <AlertMessage type={feedback.type} message={feedback.message} />
          </div>
        ) : null}
        <div className="mt-4">
          <UploadForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-kassena-green">
          Recent uploads
        </h2>
        {isLoading ? (
          <div className="mt-4">
            <LoadingState />
          </div>
        ) : visibleRecords.length ? (
          <div className="mt-4 space-y-3">
            {visibleRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-lg border border-kassena-cream p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-kassena-green">
                    {record.title}
                  </h3>
                  <StatusBadge status={record.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{record.category}</p>
                {record.dialect || record.consentStatus ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {[record.dialect, record.consentStatus]
                      .filter(Boolean)
                      .join(' - ')}
                  </p>
                ) : null}
                <MediaPreview
                  className="mt-3"
                  compact
                  file={{
                    name: record.fileName,
                    url: record.fileUrl,
                    contentType: record.contentType,
                  }}
                  title={record.title}
                />
                <a
                  className="mt-2 inline-block text-sm text-kassena-orange"
                  href={record.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View file
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState message="No uploads found." />
          </div>
        )}
      </div>
    </section>
  )
}
