import { useState } from 'react'
import { UPLOAD_CATEGORIES } from '../../lib/constants'
import { AlertMessage } from '../common/AlertMessage'

export interface UploadFormValues {
  title: string
  description: string
  category: string
  file?: File
}

export const UploadForm = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: UploadFormValues) => Promise<void>
  isSubmitting: boolean
}) => {
  const [values, setValues] = useState<UploadFormValues>({
    title: '',
    description: '',
    category: '',
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
    setValues({ title: '', description: '', category: '' })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <AlertMessage type="error" message={error} /> : null}
      <label className="block space-y-1 text-sm">
        <span>Title *</span>
        <input
          value={values.title}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, title: event.target.value }))
          }
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Description</span>
        <textarea
          value={values.description}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, description: event.target.value }))
          }
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
      </label>
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
