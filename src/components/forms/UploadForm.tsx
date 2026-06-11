import { useRef, useState } from 'react'
import { DIALECT_OPTIONS, UPLOAD_CATEGORIES } from '../../lib/constants'
import { AlertMessage } from '../common/AlertMessage'
import { KasemKeyboard } from '../KasemKeyboard'

export interface UploadFormValues {
  title: string
  description: string
  category: string
  dialect: string
  consentStatus: 'not_required' | 'pending' | 'received'
  culturalSensitivity: 'public' | 'private_archive' | 'restricted'
  tags: string
  file?: File
}

export const UploadForm = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: UploadFormValues) => Promise<void>
  isSubmitting: boolean
}) => {
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<UploadFormValues>({
    title: '',
    description: '',
    category: '',
    dialect: '',
    consentStatus: 'pending',
    culturalSensitivity: 'public',
    tags: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!values.title.trim() || !values.category || !values.file) {
      setError('Title, category and file are required.')
      return
    }

    setError('')
    await onSubmit(values)
    setValues({
      title: '',
      description: '',
      category: '',
      dialect: '',
      consentStatus: 'pending',
      culturalSensitivity: 'public',
      tags: '',
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <AlertMessage type="error" message={error} /> : null}
      <div>
        <label className="block space-y-1 text-sm">
          <span>Title *</span>
          <input
            ref={titleRef}
            value={values.title}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, title: event.target.value }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
        <KasemKeyboard inputRef={titleRef} context="upload_title" />
      </div>
      <div>
        <label className="block space-y-1 text-sm">
          <span>Description</span>
          <textarea
            ref={descriptionRef}
            value={values.description}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
        <KasemKeyboard
          inputRef={descriptionRef}
          context="upload_description"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>Category *</span>
          <select
            value={values.category}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, category: event.target.value }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="">Select category</option>
            {UPLOAD_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>Dialect/region</span>
          <select
            value={values.dialect}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, dialect: event.target.value }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="">Select dialect</option>
            {DIALECT_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>Consent status</span>
          <select
            value={values.consentStatus}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                consentStatus: event.target
                  .value as UploadFormValues['consentStatus'],
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="pending">Needs review</option>
            <option value="received">Consent received</option>
            <option value="not_required">Not required</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>Cultural sensitivity</span>
          <select
            value={values.culturalSensitivity}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                culturalSensitivity: event.target
                  .value as UploadFormValues['culturalSensitivity'],
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="public">Public after approval</option>
            <option value="private_archive">Private archive</option>
            <option value="restricted">Restricted cultural content</option>
          </select>
        </label>
      </div>
      <div>
        <label className="block space-y-1 text-sm">
          <span>Tags</span>
          <input
            ref={tagsRef}
            value={values.tags}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, tags: event.target.value }))
            }
            placeholder="education, story, song, proverb"
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
        <KasemKeyboard inputRef={tagsRef} context="upload_tags" />
      </div>
      <label className="block space-y-1 text-sm">
        <span>File *</span>
        <input
          type="file"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, file: event.target.files?.[0] }))
          }
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-kassena-orange px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Uploading…' : 'Upload file'}
      </button>
    </form>
  )
}
