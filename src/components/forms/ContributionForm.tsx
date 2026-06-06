import { useMemo, useRef, useState } from 'react'
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
  alternateKasemTerms: string
  englishExample: string
  kasemExample: string
  dialect: string
  partOfSpeech: string
  category: string
  notes: string
  wordUseRules?: string
  pronunciation: string
  culturalNote: string
  file?: File
  audioFile?: File
}

const defaultValues: ContributionFormValues = {
  englishText: '',
  kasemText: '',
  alternateKasemTerms: '',
  englishExample: '',
  kasemExample: '',
  dialect: '',
  partOfSpeech: '',
  category: '',
  notes: '',
  wordUseRules: '',
  pronunciation: '',
  culturalNote: '',
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
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioInputRef = useRef<HTMLInputElement>(null)

  const canSubmit = useMemo(
    () =>
      !isSubmitting &&
      values.englishText.trim() &&
      values.kasemText.trim() &&
      values.pronunciation.trim(),
    [isSubmitting, values.englishText, values.kasemText, values.pronunciation],
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validateContribution(values)
    if (errors.length) {
      setError(errors.join(' '))
      return
    }

    if (!values.pronunciation.trim()) {
      setError('Pronunciation is required.')
      return
    }

    setError('')
    await onSubmit(values)
    setValues(defaultValues)
    setRecordedAudioUrl(null)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedAudioUrl(audioUrl)

        const audioFile = new File([audioBlob], `pronunciation-${Date.now()}.webm`, {
          type: 'audio/webm',
        })
        setValues((prev) => ({ ...prev, audioFile }))

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      setError('Could not access microphone. Please check browser permissions.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValues((prev) => ({ ...prev, audioFile: file }))
      const url = URL.createObjectURL(file)
      setRecordedAudioUrl(url)
    }
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

      <label className="space-y-1 text-sm">
        <span>Pronunciation (phonetic guide) *</span>
        <input
          value={values.pronunciation}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pronunciation: event.target.value }))
          }
          placeholder="/lám/ — type how the word sounds"
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
        <span className="text-xs text-slate-500">
          Required. Example: /lám/ for &ldquo;water&rdquo;
        </span>
      </label>

      <div className="space-y-2">
        <span className="text-sm font-medium">Audio Pronunciation *</span>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-kassena-green text-white hover:bg-kassena-dark'
            }`}
          >
            {isRecording ? (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                Stop Recording
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Record Audio
              </>
            )}
          </button>

          <span className="text-sm text-slate-500">or</span>

          <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-kassena-cream px-4 py-2 text-sm font-semibold text-kassena-green hover:bg-kassena-bg transition-all">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Audio
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioFileChange}
              className="hidden"
            />
          </label>
        </div>

        {recordedAudioUrl && (
          <div className="mt-2 rounded-lg border border-kassena-cream bg-kassena-bg p-3">
            <audio controls preload="metadata" className="w-full">
              <source src={recordedAudioUrl} />
              Your browser does not support this audio file.
            </audio>
            <p className="mt-1 text-xs text-green-600 font-semibold">Audio recorded successfully</p>
          </div>
        )}

        <span className="text-xs text-slate-500">
          Required. Record or upload the pronunciation for this word.
        </span>
      </div>

      <label className="space-y-1 text-sm">
        <span>Other ways of saying this in Kasem</span>
        <textarea
          value={values.alternateKasemTerms}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              alternateKasemTerms: event.target.value,
            }))
          }
          placeholder="Add alternate spellings, dialect variants or similar phrases"
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
      </label>

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
        <span>Cultural note</span>
        <textarea
          value={values.culturalNote}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, culturalNote: event.target.value }))
          }
          placeholder="Any cultural context, usage restrictions, or traditional meaning"
          className="w-full rounded-lg border border-kassena-cream px-3 py-2"
        />
      </label>

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
