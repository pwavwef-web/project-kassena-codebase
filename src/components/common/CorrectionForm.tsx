import { useRef, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createCorrection } from '../../lib/firestore'
import { DIALECT_OPTIONS } from '../../lib/constants'
import { KasemKeyboard } from '../KasemKeyboard'

interface CorrectionFormProps {
  dictionaryEntryId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const CorrectionForm = ({
  dictionaryEntryId,
  onSuccess,
  onCancel,
}: CorrectionFormProps) => {
  const { appUser } = useAuth()
  const kasemTextRef = useRef<HTMLInputElement>(null)
  const pronunciationRef = useRef<HTMLInputElement>(null)
  const culturalNoteRef = useRef<HTMLTextAreaElement>(null)
  const notesRef = useRef<HTMLTextAreaElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [values, setValues] = useState({
    englishText: '',
    kasemText: '',
    alternateKasemTerms: '',
    englishExample: '',
    kasemExample: '',
    dialect: '',
    partOfSpeech: '',
    category: '',
    pronunciation: '',
    culturalNote: '',
    notes: '',
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!appUser) return

    setIsSubmitting(true)
    setFeedback('')

    try {
      await createCorrection(dictionaryEntryId, values, {
        id: appUser.uid,
        name: appUser.displayName,
        email: appUser.email,
      })
      setFeedback('Correction submitted! It will be reviewed by our team.')
      setTimeout(() => onSuccess?.(), 2000)
    } catch {
      setFeedback('Failed to submit correction. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="space-y-3 rounded-xl border border-kassena-cream bg-slate-50 p-4"
      onSubmit={handleSubmit}
    >
      <h3 className="text-sm font-bold text-kassena-green">
        Suggest a Correction
      </h3>

      {feedback && (
        <p
          className={`text-sm ${
            feedback.includes('Failed') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {feedback}
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="space-y-1 text-sm">
            <span>Corrected Kasem text</span>
            <input
              ref={kasemTextRef}
              value={values.kasemText}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  kasemText: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-kassena-cream px-3 py-2 text-sm"
            />
          </label>
          <KasemKeyboard
            inputRef={kasemTextRef}
            context="correction_kasem_text"
          />
        </div>

        <label className="space-y-1 text-sm">
          <span>Alternative dialect</span>
          <select
            value={values.dialect}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, dialect: event.target.value }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2 text-sm"
          >
            <option value="">Select dialect</option>
            {DIALECT_OPTIONS.map((dialect) => (
              <option key={dialect} value={dialect}>
                {dialect}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label className="space-y-1 text-sm">
          <span>Pronunciation</span>
          <input
            ref={pronunciationRef}
            value={values.pronunciation}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                pronunciation: event.target.value,
              }))
            }
            placeholder="/lam/"
            className="w-full rounded-lg border border-kassena-cream px-3 py-2 text-sm"
          />
        </label>
        <KasemKeyboard
          inputRef={pronunciationRef}
          context="correction_pronunciation"
        />
      </div>

      <div>
        <label className="space-y-1 text-sm">
          <span>Cultural note</span>
          <textarea
            ref={culturalNoteRef}
            value={values.culturalNote}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                culturalNote: event.target.value,
              }))
            }
            placeholder="Any cultural context or usage notes"
            className="w-full rounded-lg border border-kassena-cream px-3 py-2 text-sm"
          />
        </label>
        <KasemKeyboard
          inputRef={culturalNoteRef}
          context="correction_cultural_note"
        />
      </div>

      <div>
        <label className="space-y-1 text-sm">
          <span>Notes</span>
          <textarea
            ref={notesRef}
            value={values.notes}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, notes: event.target.value }))
            }
            placeholder="Why is this correction needed?"
            className="w-full rounded-lg border border-kassena-cream px-3 py-2 text-sm"
          />
        </label>
        <KasemKeyboard inputRef={notesRef} context="correction_notes" />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-kassena-orange px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Correction'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
