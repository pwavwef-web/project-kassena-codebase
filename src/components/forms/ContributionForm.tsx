import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertMessage } from '../common/AlertMessage'
import { AppIcon } from '../common/AppIcon'
import {
  CATEGORY_OPTIONS,
  DIALECT_OPTIONS,
  PART_OF_SPEECH_OPTIONS,
} from '../../lib/constants'
import { validateContribution } from '../../lib/validators'
import type { DictionaryEntry, RewardBounty } from '../../types'

type ContributionStep = 0 | 1 | 2 | 3

export type VoiceContributionType =
  | 'pronunciation'
  | 'exampleSentence'
  | 'culturalExplanation'

export interface VoiceContribution {
  id: string
  type: VoiceContributionType
  file: File
  previewUrl: string
}

export interface ContributionFormValues {
  contributionType: string
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
  selectedBountyId?: string
  selectedBountyTitle?: string
  file?: File
  audioFile?: File
  voiceRecordings: VoiceContribution[]
}

interface QualityScore {
  score: number
  suggestions: string[]
}

interface ImpactStats {
  words: number
  audioRecordings: number
  points: number
  rank: number | null
}

interface ContributionFormProps {
  onSubmit: (values: ContributionFormValues) => Promise<void>
  isSubmitting: boolean
  dictionaryEntries?: DictionaryEntry[]
  bounties?: RewardBounty[]
  impactStats?: ImpactStats
  submissionComplete?: boolean
  onStartAnother?: () => void
}

const contributionTypes = [
  'Word',
  'Proverb',
  'Story',
  'Song',
  'Cultural Fact',
  'Oral History',
]

const stepLabels = [
  'Word Contribution',
  'Examples',
  'Language Details',
  'Advanced Information',
] as const

const voiceLabels: Record<VoiceContributionType, string> = {
  pronunciation: 'Pronunciation',
  exampleSentence: 'Example sentence',
  culturalExplanation: 'Cultural explanation',
}

const draftKey = 'project-kasena-contribution-draft'

const defaultValues: ContributionFormValues = {
  contributionType: 'Word',
  englishText: '',
  kasemText: '',
  alternateKasemTerms: '',
  englishExample: '',
  kasemExample: '',
  dialect: 'Not sure',
  partOfSpeech: '',
  category: 'General vocabulary',
  notes: '',
  wordUseRules: '',
  pronunciation: '',
  culturalNote: '',
  selectedBountyId: '',
  selectedBountyTitle: '',
  voiceRecordings: [],
}

const getDraftValues = (): ContributionFormValues => {
  if (typeof window === 'undefined') {
    return defaultValues
  }

  try {
    const raw = window.localStorage.getItem(draftKey)
    if (!raw) {
      return defaultValues
    }

    const parsed = JSON.parse(raw) as Partial<ContributionFormValues>

    return {
      ...defaultValues,
      ...parsed,
      file: undefined,
      audioFile: undefined,
      voiceRecordings: [],
    }
  } catch {
    return defaultValues
  }
}

const saveDraft = (values: ContributionFormValues) => {
  if (typeof window === 'undefined') {
    return
  }

  const { audioFile, file, voiceRecordings, ...serializableValues } = values
  void audioFile
  void file
  void voiceRecordings
  window.localStorage.setItem(draftKey, JSON.stringify(serializableValues))
}

const clearDraft = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(draftKey)
}

const normalize = (value: string) => value.trim().toLowerCase()

const getQualityScore = (values: ContributionFormValues): QualityScore => {
  let score = 0
  const suggestions: string[] = []

  if (values.englishText.trim()) {
    score += 20
  }

  if (values.kasemText.trim()) {
    score += 25
  }

  if (values.englishExample.trim() || values.kasemExample.trim()) {
    score += 15
  } else {
    suggestions.push('Add example sentence')
  }

  if (values.dialect && values.dialect !== 'Not sure') {
    score += 10
  } else {
    suggestions.push('Add dialect')
  }

  if (values.category.trim()) {
    score += 10
  }

  if (values.partOfSpeech.trim()) {
    score += 5
  }

  if (values.pronunciation.trim() || values.voiceRecordings.length) {
    score += 10
  } else {
    suggestions.push('Add pronunciation')
  }

  if (
    values.alternateKasemTerms.trim() ||
    values.notes.trim() ||
    values.wordUseRules?.trim() ||
    values.culturalNote.trim() ||
    values.file
  ) {
    score += 5
  }

  return {
    score: Math.min(100, score),
    suggestions: suggestions.slice(0, 3),
  }
}

const rewardPreview = {
  submitPoints: 10,
  approvalBonus: 5,
}

const baseInputClass =
  'w-full rounded-xl border border-kassena-cream bg-white px-3 py-3 text-sm outline-none transition focus:border-kassena-green focus:ring-2 focus:ring-kassena-green/15'

const GhostButton = ({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="rounded-xl border border-kassena-cream bg-white px-4 py-3 text-sm font-black text-kassena-green shadow-sm transition hover:bg-kassena-bg disabled:cursor-not-allowed disabled:opacity-50"
  >
    {children}
  </button>
)

const PrimaryButton = ({
  children,
  disabled = false,
  type = 'button',
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="rounded-xl bg-kassena-green px-5 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(20,83,45,0.18)] transition hover:bg-kassena-dark disabled:cursor-not-allowed disabled:opacity-60"
  >
    {children}
  </button>
)

const FieldLabel = ({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) => (
  <label className="space-y-1.5 text-sm font-semibold text-slate-700">
    <span>
      {label}
      {required ? <span className="text-kassena-orange"> *</span> : null}
    </span>
    {children}
  </label>
)

const VoiceIcon = () => <AppIcon name="microphone" className="h-5 w-5" />

const UploadIcon = () => <AppIcon name="upload" className="h-5 w-5" />

const CheckIcon = () => <AppIcon name="check" className="h-full w-full" />

export const ContributionForm = ({
  onSubmit,
  isSubmitting,
  dictionaryEntries = [],
  bounties = [],
  impactStats,
  submissionComplete = false,
  onStartAnother,
}: ContributionFormProps) => {
  const [values, setValues] = useState<ContributionFormValues>(getDraftValues)
  const [step, setStep] = useState<ContributionStep>(0)
  const [error, setError] = useState('')
  const [draftStatus, setDraftStatus] = useState(
    () =>
      typeof window !== 'undefined' && window.localStorage.getItem(draftKey)
        ? 'Draft resumed'
        : '',
  )
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] =
    useState<VoiceContributionType>('pronunciation')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioInputRef = useRef<HTMLInputElement>(null)
  const voiceRecordingsRef = useRef<VoiceContribution[]>([])

  const quality = useMemo(() => getQualityScore(values), [values])
  const canContinueFromStepOne = Boolean(
    values.englishText.trim() && values.kasemText.trim(),
  )
  const canSubmit = !isSubmitting && canContinueFromStepOne

  const exactDuplicate = useMemo(() => {
    const english = normalize(values.englishText)
    const kasem = normalize(values.kasemText)

    if (!english && !kasem) {
      return null
    }

    return (
      dictionaryEntries.find((entry) => {
        const entryEnglish = normalize(entry.englishText)
        const entryKasem = normalize(entry.kasemText)

        return (
          (english && entryEnglish === english) ||
          (kasem && entryKasem === kasem) ||
          (english && kasem && entryEnglish === english && entryKasem === kasem)
        )
      }) ?? null
    )
  }, [dictionaryEntries, values.englishText, values.kasemText])

  const suggestions = useMemo(() => {
    const english = normalize(values.englishText)
    const kasem = normalize(values.kasemText)
    const tokens = `${english} ${kasem}`
      .split(/\s+/)
      .filter((token) => token.length >= 3)

    return dictionaryEntries
      .filter((entry) => {
        if (exactDuplicate?.id === entry.id) {
          return false
        }

        const haystack = normalize(
          [
            entry.englishText,
            entry.kasemText,
            entry.alternateKasemTerms,
            entry.category,
          ]
            .filter(Boolean)
            .join(' '),
        )

        return (
          tokens.some((token) => haystack.includes(token)) ||
          Boolean(
            values.category &&
              values.category !== 'General vocabulary' &&
              entry.category === values.category,
          )
        )
      })
      .slice(0, 3)
  }, [
    dictionaryEntries,
    exactDuplicate?.id,
    values.category,
    values.englishText,
    values.kasemText,
  ])

  const selectedBounty = useMemo(
    () => bounties.find((bounty) => bounty.id === values.selectedBountyId),
    [bounties, values.selectedBountyId],
  )

  const hasDraftableContent = Boolean(
    values.englishText.trim() ||
      values.kasemText.trim() ||
      values.englishExample.trim() ||
      values.kasemExample.trim() ||
      values.alternateKasemTerms.trim() ||
      values.notes.trim() ||
      values.wordUseRules?.trim() ||
      values.pronunciation.trim() ||
      values.culturalNote.trim() ||
      values.selectedBountyId,
  )

  const totalRewardPoints =
    rewardPreview.submitPoints +
    rewardPreview.approvalBonus +
    (selectedBounty?.pointsPerContribution ?? 0)

  useEffect(() => {
    if (submissionComplete) {
      return undefined
    }

    if (!hasDraftableContent) {
      clearDraft()
      return undefined
    }

    const timer = window.setTimeout(() => {
      saveDraft(values)
      setDraftStatus('Draft saved')
    }, 500)

    return () => window.clearTimeout(timer)
  }, [hasDraftableContent, submissionComplete, values])

  useEffect(() => {
    voiceRecordingsRef.current = values.voiceRecordings
  }, [values.voiceRecordings])

  useEffect(
    () => () => {
      voiceRecordingsRef.current.forEach((recording) =>
        URL.revokeObjectURL(recording.previewUrl),
      )
    },
    [],
  )

  const updateValues = (patch: Partial<ContributionFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }))
    setError('')
  }

  const goToStep = (nextStep: ContributionStep) => {
    if (nextStep > 0 && !canContinueFromStepOne) {
      setError('Add the English word and Kasem translation first.')
      return
    }

    setStep(nextStep)
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validateContribution(values)
    if (errors.length) {
      setError(errors.join(' '))
      setStep(0)
      return
    }

    setError('')
    await onSubmit(values)
  }

  const addVoiceContribution = (
    file: File,
    type: VoiceContributionType,
    previewUrl?: string,
  ) => {
    const finalPreviewUrl = previewUrl ?? URL.createObjectURL(file)
    const nextRecording: VoiceContribution = {
      id: `${type}-${Date.now()}`,
      type,
      file,
      previewUrl: finalPreviewUrl,
    }

    setValues((prev) => ({
      ...prev,
      audioFile:
        type === 'pronunciation' && !prev.audioFile ? file : prev.audioFile,
      voiceRecordings: [...prev.voiceRecordings, nextRecording],
    }))
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        })
        const audioUrl = URL.createObjectURL(audioBlob)
        const audioFile = new File(
          [audioBlob],
          `${recordingType}-${Date.now()}.webm`,
          {
            type: 'audio/webm',
          },
        )
        addVoiceContribution(audioFile, recordingType, audioUrl)

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
      addVoiceContribution(file, recordingType)
      event.target.value = ''
    }
  }

  const removeVoiceContribution = (id: string) => {
    setValues((prev) => {
      const recording = prev.voiceRecordings.find((item) => item.id === id)
      if (recording) {
        URL.revokeObjectURL(recording.previewUrl)
      }

      const voiceRecordings = prev.voiceRecordings.filter(
        (item) => item.id !== id,
      )

      return {
        ...prev,
        voiceRecordings,
        audioFile:
          prev.audioFile && recording?.file === prev.audioFile
            ? voiceRecordings.find((item) => item.type === 'pronunciation')?.file
            : prev.audioFile,
      }
    })
  }

  const clearSavedDraft = () => {
    clearDraft()
    setValues(defaultValues)
    setDraftStatus('')
    setStep(0)
  }

  const applyBounty = (bounty: RewardBounty) => {
    updateValues({
      selectedBountyId: bounty.id,
      selectedBountyTitle: bounty.title,
      category: bounty.title.toLowerCase().includes('medical')
        ? 'Health'
        : values.category,
    })
  }

  const handleStartAnother = () => {
    setStep(0)
    setValues(defaultValues)
    setError('')
    clearDraft()
    setDraftStatus('')
    onStartAnother?.()
  }

  if (submissionComplete) {
    const nextTarget = Math.max(
      100,
      Math.ceil((impactStats?.points ?? 0) / 100) * 100 + 100,
    )
    const nextProgress = Math.min(
      100,
      (((impactStats?.points ?? 0) + rewardPreview.submitPoints) / nextTarget) *
        100,
    )

    return (
      <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_44px_rgba(20,83,45,0.12)] ring-1 ring-kassena-cream">
        <div className="bg-[#0b4b2b] px-5 py-7 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-kassena-gold text-[#0b4b2b] ring-4 ring-white/20">
            <CheckIcon />
          </div>
          <h2 className="mt-4 text-3xl font-black">Contribution Submitted</h2>
          <p className="mt-2 text-lg font-black text-kassena-gold">
            +{rewardPreview.submitPoints} Points Earned
          </p>
          <p className="mt-2 text-sm font-semibold text-white/82">
            Thank You For Preserving Kasem
          </p>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-2xl bg-[#fff8ed] p-4 ring-1 ring-kassena-cream">
            <div className="flex items-center justify-between gap-3 text-sm font-black text-[#173323]">
              <span>Progress to next reward</span>
              <span>{Math.round(nextProgress)}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#eadcc4]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-kassena-gold to-kassena-orange"
                style={{ width: `${nextProgress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-kassena-bg p-4 text-center">
              <p className="text-2xl font-black text-kassena-green">
                {impactStats?.words ?? 0}
              </p>
              <p className="text-xs font-bold text-slate-500">Words</p>
            </div>
            <div className="rounded-2xl bg-kassena-bg p-4 text-center">
              <p className="text-2xl font-black text-kassena-green">
                {impactStats?.audioRecordings ?? 0}
              </p>
              <p className="text-xs font-bold text-slate-500">Audio</p>
            </div>
            <div className="rounded-2xl bg-kassena-bg p-4 text-center">
              <p className="text-2xl font-black text-kassena-green">
                #{impactStats?.rank ?? '-'}
              </p>
              <p className="text-xs font-bold text-slate-500">Rank</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <PrimaryButton onClick={handleStartAnother}>
              Add another contribution
            </PrimaryButton>
            <Link
              to="/rewards"
              className="rounded-xl border border-kassena-cream bg-white px-5 py-3 text-sm font-black text-kassena-green shadow-sm"
            >
              View rewards
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form
        className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_44px_rgba(20,83,45,0.12)] ring-1 ring-kassena-cream"
        onSubmit={handleSubmit}
      >
        <div className="border-b border-kassena-cream bg-[#fffaf1] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-kassena-orange">
                Step {step + 1} of {stepLabels.length}
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#173323]">
                {stepLabels[step]}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {draftStatus ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-kassena-green ring-1 ring-kassena-cream">
                  {draftStatus}
                </span>
              ) : null}
              <GhostButton onClick={clearSavedDraft}>Clear draft</GhostButton>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {stepLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => goToStep(index as ContributionStep)}
                className={`h-2 rounded-full transition ${
                  index <= step ? 'bg-kassena-orange' : 'bg-[#eadcc4]'
                }`}
                aria-label={`Go to ${label}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          {error ? <AlertMessage type="error" message={error} /> : null}

          {step === 0 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Contribution type
                </span>
                <div className="flex flex-wrap gap-2">
                  {contributionTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateValues({ contributionType: type })}
                      className={`rounded-full px-3 py-2 text-xs font-black transition ${
                        values.contributionType === type
                          ? 'bg-kassena-green text-white'
                          : 'bg-kassena-bg text-kassena-green ring-1 ring-kassena-cream'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldLabel label="English Word" required>
                  <input
                    value={values.englishText}
                    onChange={(event) =>
                      updateValues({ englishText: event.target.value })
                    }
                    className={baseInputClass}
                    autoFocus
                  />
                </FieldLabel>
                <FieldLabel label="Kasem Translation" required>
                  <input
                    value={values.kasemText}
                    onChange={(event) =>
                      updateValues({ kasemText: event.target.value })
                    }
                    className={baseInputClass}
                  />
                </FieldLabel>
              </div>

              {exactDuplicate ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="font-black">Possible duplicate found</p>
                  <p className="mt-1">
                    {exactDuplicate.englishText} - {exactDuplicate.kasemText}
                  </p>
                  <Link
                    to="/dictionary"
                    className="mt-2 inline-flex text-xs font-black text-kassena-green"
                  >
                    Review dictionary entry
                  </Link>
                </div>
              ) : null}

              {suggestions.length ? (
                <div className="rounded-2xl bg-kassena-bg p-4 ring-1 ring-kassena-cream">
                  <p className="text-sm font-black text-[#173323]">
                    Smart suggestions
                  </p>
                  <div className="mt-3 grid gap-2">
                    {suggestions.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-kassena-cream"
                      >
                        <span className="font-black text-kassena-green">
                          {entry.englishText}
                        </span>{' '}
                        <span className="text-slate-500">
                          {entry.kasemText} - {entry.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <FieldLabel label="English Example">
                  <textarea
                    value={values.englishExample}
                    onChange={(event) =>
                      updateValues({ englishExample: event.target.value })
                    }
                    className={`${baseInputClass} min-h-28`}
                  />
                </FieldLabel>
                <FieldLabel label="Kasem Example">
                  <textarea
                    value={values.kasemExample}
                    onChange={(event) =>
                      updateValues({ kasemExample: event.target.value })
                    }
                    className={`${baseInputClass} min-h-28`}
                  />
                </FieldLabel>
              </div>

              <div className="rounded-2xl bg-[#fff8ed] p-4 ring-1 ring-kassena-cream">
                <p className="text-sm font-black text-[#173323]">
                  Tip: good example sentences
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Use a short everyday sentence that makes the meaning clear.
                </p>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <FieldLabel label="Dialect">
                  <select
                    value={values.dialect}
                    onChange={(event) =>
                      updateValues({ dialect: event.target.value })
                    }
                    className={baseInputClass}
                  >
                    {DIALECT_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </FieldLabel>
                <FieldLabel label="Part of Speech">
                  <select
                    value={values.partOfSpeech}
                    onChange={(event) =>
                      updateValues({ partOfSpeech: event.target.value })
                    }
                    className={baseInputClass}
                  >
                    <option value="">Select part of speech</option>
                    {PART_OF_SPEECH_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </FieldLabel>
                <FieldLabel label="Category">
                  <select
                    value={values.category}
                    onChange={(event) =>
                      updateValues({ category: event.target.value })
                    }
                    className={baseInputClass}
                  >
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </FieldLabel>
              </div>

              <div className="rounded-2xl bg-[#fff8ed] p-4 ring-1 ring-kassena-cream">
                <p className="text-sm font-black text-[#173323]">
                  Tip: proper dialect tagging
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Choose "Not sure" when needed, then add a note if a validator
                  should confirm the region.
                </p>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <FieldLabel label="Alternative Spellings">
                <textarea
                  value={values.alternateKasemTerms}
                  onChange={(event) =>
                    updateValues({ alternateKasemTerms: event.target.value })
                  }
                  placeholder="Alternate spellings, dialect variants, or similar phrases"
                  className={`${baseInputClass} min-h-24`}
                />
              </FieldLabel>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldLabel label="Pronunciation">
                  <input
                    value={values.pronunciation}
                    onChange={(event) =>
                      updateValues({ pronunciation: event.target.value })
                    }
                    placeholder="/lam/ - type how the word sounds"
                    className={baseInputClass}
                  />
                </FieldLabel>
                <FieldLabel label="Supporting File">
                  <input
                    type="file"
                    onChange={(event) =>
                      updateValues({ file: event.target.files?.[0] })
                    }
                    className={baseInputClass}
                  />
                </FieldLabel>
              </div>

              <FieldLabel label="Notes">
                <textarea
                  value={values.notes}
                  onChange={(event) => updateValues({ notes: event.target.value })}
                  className={`${baseInputClass} min-h-24`}
                />
              </FieldLabel>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldLabel label="Word Rules">
                  <textarea
                    value={values.wordUseRules}
                    onChange={(event) =>
                      updateValues({ wordUseRules: event.target.value })
                    }
                    placeholder="Grammar, usage restrictions, or typical context"
                    className={`${baseInputClass} min-h-24`}
                  />
                </FieldLabel>
                <FieldLabel label="Cultural Note">
                  <textarea
                    value={values.culturalNote}
                    onChange={(event) =>
                      updateValues({ culturalNote: event.target.value })
                    }
                    placeholder="Traditional meaning, ceremony, or cultural context"
                    className={`${baseInputClass} min-h-24`}
                  />
                </FieldLabel>
              </div>

              <div className="rounded-2xl bg-kassena-bg p-4 ring-1 ring-kassena-cream">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#173323]">
                      Voice Contributions
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Record pronunciation, an example sentence, or cultural
                      explanation.
                    </p>
                  </div>
                  <select
                    value={recordingType}
                    onChange={(event) =>
                      setRecordingType(event.target.value as VoiceContributionType)
                    }
                    className="rounded-xl border border-kassena-cream bg-white px-3 py-2 text-sm font-bold text-kassena-green"
                  >
                    {Object.entries(voiceLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                      isRecording
                        ? 'animate-pulse bg-red-500 text-white'
                        : 'bg-kassena-green text-white hover:bg-kassena-dark'
                    }`}
                  >
                    <VoiceIcon />
                    {isRecording ? 'Stop Recording' : 'Record Audio'}
                  </button>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-kassena-cream bg-white px-4 py-3 text-sm font-black text-kassena-green transition hover:bg-kassena-bg">
                    <UploadIcon />
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

                {values.voiceRecordings.length ? (
                  <div className="mt-4 space-y-3">
                    {values.voiceRecordings.map((recording) => (
                      <div
                        key={recording.id}
                        className="rounded-2xl bg-white p-3 ring-1 ring-kassena-cream"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-xs font-black text-kassena-green">
                            {voiceLabels[recording.type]}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVoiceContribution(recording.id)}
                            className="text-xs font-black text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                        <audio controls preload="metadata" className="w-full">
                          <source src={recording.previewUrl} />
                          Your browser does not support this audio file.
                        </audio>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl bg-[#fff8ed] p-4 ring-1 ring-kassena-cream">
                <p className="text-sm font-black text-[#173323]">
                  Common mistake to avoid
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Do not mix several unrelated meanings in one contribution.
                  Add a second entry instead.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-kassena-cream bg-white p-4 sm:p-5">
          <div className="text-xs font-semibold text-slate-500">
            Earn +{rewardPreview.submitPoints} points, +{rewardPreview.approvalBonus}{' '}
            bonus if approved
          </div>
          <div className="flex flex-wrap gap-3">
            {step > 0 ? (
              <GhostButton onClick={() => goToStep((step - 1) as ContributionStep)}>
                Back
              </GhostButton>
            ) : null}

            {step === 1 ? (
              <GhostButton onClick={() => goToStep(2)}>Skip examples</GhostButton>
            ) : null}

            {step < 2 ? (
              <PrimaryButton
                onClick={() => goToStep((step + 1) as ContributionStep)}
                disabled={step === 0 && !canContinueFromStepOne}
              >
                Continue
              </PrimaryButton>
            ) : null}

            {step === 2 ? (
              <>
                <GhostButton onClick={() => goToStep(3)}>
                  Add advanced info
                </GhostButton>
                <PrimaryButton type="submit" disabled={!canSubmit}>
                  {isSubmitting ? 'Submitting...' : 'Submit now'}
                </PrimaryButton>
              </>
            ) : null}

            {step === 3 ? (
              <PrimaryButton type="submit" disabled={!canSubmit}>
                {isSubmitting ? 'Submitting...' : 'Submit contribution'}
              </PrimaryButton>
            ) : null}
          </div>
        </div>
      </form>

      <aside className="space-y-4">
        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-kassena-cream">
          <p className="text-sm font-black text-[#173323]">Earn</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#fff8ed] p-3">
              <p className="text-2xl font-black text-kassena-orange">
                +{rewardPreview.submitPoints}
              </p>
              <p className="text-xs font-bold text-slate-500">Points</p>
            </div>
            <div className="rounded-2xl bg-[#edf7ed] p-3">
              <p className="text-2xl font-black text-kassena-green">
                +{rewardPreview.approvalBonus}
              </p>
              <p className="text-xs font-bold text-slate-500">
                Bonus if approved
              </p>
            </div>
          </div>
          {selectedBounty ? (
            <p className="mt-3 rounded-2xl bg-kassena-green px-3 py-2 text-xs font-black text-white">
              +{selectedBounty.pointsPerContribution} campaign bonus selected
            </p>
          ) : null}
          <p className="mt-3 text-xs font-bold text-slate-500">
            Potential total: +{totalRewardPoints} points
          </p>
        </section>

        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-kassena-cream">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-[#173323]">Quality Score</p>
            <p className="text-2xl font-black text-kassena-green">
              {quality.score}%
            </p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eadcc4]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-kassena-gold to-kassena-green"
              style={{ width: `${quality.score}%` }}
            />
          </div>
          <div className="mt-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Suggestions
            </p>
            {quality.suggestions.length ? (
              <ul className="mt-2 space-y-2">
                {quality.suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="rounded-xl bg-kassena-bg px-3 py-2 text-xs font-bold text-slate-600"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 rounded-xl bg-[#edf7ed] px-3 py-2 text-xs font-black text-kassena-green">
                Strong contribution
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-kassena-cream">
          <p className="text-sm font-black text-[#173323]">Active Campaigns</p>
          <div className="mt-3 space-y-3">
            {bounties.length ? (
              bounties.slice(0, 3).map((bounty) => {
                const progress = Math.min(
                  100,
                  (bounty.currentContributions /
                    Math.max(1, bounty.targetContributions)) *
                    100,
                )

                return (
                  <button
                    type="button"
                    key={bounty.id}
                    onClick={() => applyBounty(bounty)}
                    className={`w-full rounded-2xl p-3 text-left ring-1 transition ${
                      values.selectedBountyId === bounty.id
                        ? 'bg-[#edf7ed] ring-kassena-green'
                        : 'bg-kassena-bg ring-kassena-cream'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-black text-kassena-green">
                          {bounty.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          +{bounty.pointsPerContribution} Bonus Points
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-kassena-orange">
                        {bounty.deadlineLabel || 'Active'}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadcc4]">
                      <div
                        className="h-full rounded-full bg-kassena-orange"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-black text-[#173323]">
                      Add {bounty.title.toLowerCase()} vocabulary now
                    </p>
                  </button>
                )
              })
            ) : (
              <p className="rounded-2xl bg-kassena-bg px-3 py-4 text-sm font-semibold text-slate-500">
                No active campaigns yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-kassena-cream">
          <p className="text-sm font-black text-[#173323]">
            Your Contribution Impact
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-kassena-bg p-3">
              <p className="text-xl font-black text-kassena-green">
                {impactStats?.words ?? 0}
              </p>
              <p className="text-xs font-bold text-slate-500">Words</p>
            </div>
            <div className="rounded-2xl bg-kassena-bg p-3">
              <p className="text-xl font-black text-kassena-green">
                {impactStats?.audioRecordings ?? 0}
              </p>
              <p className="text-xs font-bold text-slate-500">Audio</p>
            </div>
            <div className="rounded-2xl bg-kassena-bg p-3">
              <p className="text-xl font-black text-kassena-green">
                {impactStats?.points ?? 0}
              </p>
              <p className="text-xs font-bold text-slate-500">Points</p>
            </div>
            <div className="rounded-2xl bg-kassena-bg p-3">
              <p className="text-xl font-black text-kassena-green">
                #{impactStats?.rank ?? '-'}
              </p>
              <p className="text-xs font-bold text-slate-500">Rank</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}
