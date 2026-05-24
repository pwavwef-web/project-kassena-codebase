import { useMemo, useState } from 'react'
import { AlertMessage } from '../common/AlertMessage'
import {
  CATEGORY_OPTIONS,
  DIALECT_OPTIONS,
  PART_OF_SPEECH_OPTIONS,
} from '../../lib/constants'
import { validateContribution } from '../../lib/validators'

export interface ContributionFormValues {
  englishText: string
  kasemText: string
  englishExample: string
  kasemExample: string
  dialect: string
  partOfSpeech: string
  category: string
  notes: string
  wordUseRules?: string
  file?: File
}

const defaultValues: ContributionFormValues = {
  englishText: '',
  kasemText: '',
  englishExample: '',
  kasemExample: '',
  dialect: '',
  partOfSpeech: '',
  category: '',
  notes: '',
  wordUseRules: '',
}

export const ContributionForm = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: ContributionFormValues) => Promise<void>
  isSubmitting: boolean
}) => {
  const [values, setValues] = useState<ContributionFormValues>(defaultValues)
  const [error, setError] = useState('')

  const canSubmit = useMemo(
    () => !isSubmitting && values.englishText.trim() && values.kasemText.trim(),
    [isSubmitting, values.englishText, values.kasemText],
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validateContribution(values)
    if (errors.length) {
      setError(errors.join(' '))
      return
    }

    setError('')
    await onSubmit(values)
    setValues(defaultValues)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <AlertMessage type="error" message={error} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>English word or phrase *</span>
          <input
            value={values.englishText}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                englishText: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Kasem translation *</span>
          <input
            value={values.kasemText}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, kasemText: event.target.value }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Example sentence (English)</span>
          <textarea
            value={values.englishExample}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                englishExample: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Example sentence (Kasem)</span>
          <textarea
            value={values.kasemExample}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                kasemExample: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span>Dialect/region *</span>
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
        <label className="space-y-1 text-sm">
          <span>Part of speech</span>
          <select
            value={values.partOfSpeech}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                partOfSpeech: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="">Select part of speech</option>
            {PART_OF_SPEECH_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>Category *</span>
          <select
            value={values.category}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, category: event.target.value }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span>Notes/source</span>
        <textarea
          value={values.notes}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, notes: event.target.value }))
          }
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span>Word use rules (optional)</span>
        <textarea
          value={values.wordUseRules}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, wordUseRules: event.target.value }))
          }
          placeholder="Describe grammatical constraints or typical contexts for use"
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
      </label>

      <label className="space-y-1 text-sm">
        <span>Optional supporting file</span>
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
        disabled={!canSubmit}
        className="rounded-lg bg-kassena-orange px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit contribution'}
      </button>
    </form>
  )
}
